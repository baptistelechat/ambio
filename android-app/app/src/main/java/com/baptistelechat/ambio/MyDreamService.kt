package com.baptistelechat.ambio

import android.annotation.SuppressLint
import android.graphics.Color
import android.service.dreams.DreamService
import android.view.View
import android.webkit.WebChromeClient
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.FrameLayout
import android.widget.ImageView
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.cancel
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import java.net.HttpURLConnection
import java.net.URL

class MyDreamService : DreamService() {

    companion object {
        // ponytail: IPs en dur (réseau local). Le PC de dev est testé en 1er
        // pour pouvoir itérer sans redéployer sur le RPi ; mettre à jour si
        // une IP change (bail DHCP) ou réserver les IP côté routeur.
        private val CANDIDATE_HOSTS = listOf(
            "192.168.1.74:5173", // PC de dev
            "192.168.1.210:5173", // RPi (prod)
        )
        private const val CHECK_TIMEOUT_MS = 3_000
        private const val RETRY_INTERVAL_MS = 30_000L
    }

    private var scope: CoroutineScope? = null
    private var retryJob: Job? = null
    private var webView: WebView? = null
    private var fallbackView: ImageView? = null
    private lateinit var root: FrameLayout

    override fun onAttachedToWindow() {
        super.onAttachedToWindow()
        isInteractive = false
        isFullscreen = true
        isScreenBright = true

        WebView.setWebContentsDebuggingEnabled(true)

        scope = CoroutineScope(Dispatchers.Main + Job())
        root = FrameLayout(this).apply { setBackgroundColor(Color.BLACK) }
        setContentView(root)

        scope?.launch { checkAndDisplay() }
    }

    override fun onDetachedFromWindow() {
        super.onDetachedFromWindow()
        retryJob?.cancel()
        scope?.cancel()
        webView?.destroy()
        webView = null
    }

    private suspend fun checkAndDisplay() {
        val url = findReachableUrl()
        if (url != null) {
            showWebView(url)
        } else {
            showFallback()
            startRetryLoop()
        }
    }

    private fun startRetryLoop() {
        retryJob?.cancel()
        retryJob = scope?.launch {
            while (true) {
                delay(RETRY_INTERVAL_MS)
                val url = findReachableUrl()
                if (url != null) {
                    showWebView(url)
                    break
                }
            }
        }
    }

    /** Teste chaque hôte candidat dans l'ordre, retourne l'URL du premier joignable. */
    private suspend fun findReachableUrl(): String? {
        for (host in CANDIDATE_HOSTS) {
            val url = "http://$host/screensaver"
            if (isReachable(url)) return url
        }
        return null
    }

    private suspend fun isReachable(url: String): Boolean = withContext(Dispatchers.IO) {
        try {
            val connection = (URL(url).openConnection() as HttpURLConnection).apply {
                requestMethod = "HEAD"
                connectTimeout = CHECK_TIMEOUT_MS
                readTimeout = CHECK_TIMEOUT_MS
            }
            val reachable = connection.responseCode in 200..399
            connection.disconnect()
            reachable
        } catch (e: Exception) {
            false
        }
    }

    @SuppressLint("SetJavaScriptEnabled")
    private fun showWebView(url: String) {
        retryJob?.cancel()
        fallbackView?.let { root.removeView(it) }
        fallbackView = null

        webView?.destroy()
        webView = WebView(this).apply {
            settings.javaScriptEnabled = true
            settings.domStorageEnabled = true
            settings.mediaPlaybackRequiresUserGesture = false
            // Sans ça, la WebView ignore le <meta viewport> de la page et rend en
            // mode "desktop" à une largeur virtuelle réduite au lieu de la taille écran réelle
            settings.useWideViewPort = true
            settings.loadWithOverviewMode = true
            // ponytail: reste invisible jusqu'au premier rendu pour éviter le flash blanc par défaut de la WebView
            visibility = View.INVISIBLE
            webViewClient = object : WebViewClient() {
                override fun onPageFinished(view: WebView?, url: String?) {
                    super.onPageFinished(view, url)
                    view?.visibility = View.VISIBLE
                }
            }
            webChromeClient = WebChromeClient()
            setBackgroundColor(Color.BLACK)
            loadUrl(url)
        }
        root.addView(
            webView,
            FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT,
                FrameLayout.LayoutParams.MATCH_PARENT,
            ),
        )
    }

    private fun showFallback() {
        webView?.let { root.removeView(it) }
        webView?.destroy()
        webView = null

        if (fallbackView == null) {
            fallbackView = ImageView(this).apply {
                setImageResource(R.drawable.fallback_screensaver)
                scaleType = ImageView.ScaleType.CENTER_CROP
            }
            root.addView(
                fallbackView,
                FrameLayout.LayoutParams(
                    FrameLayout.LayoutParams.MATCH_PARENT,
                    FrameLayout.LayoutParams.MATCH_PARENT,
                ),
            )
        }
    }
}

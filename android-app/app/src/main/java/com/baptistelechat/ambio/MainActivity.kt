package com.baptistelechat.ambio

import android.app.Activity
import android.content.ComponentName
import android.content.Intent
import android.os.Bundle
import android.widget.Toast

class MainActivity : Activity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val daydreamSettings = Intent().apply {
            component = ComponentName(
                "com.android.tv.settings",
                "com.android.tv.settings.device.display.daydream.DaydreamActivity",
            )
        }

        try {
            startActivity(daydreamSettings)
        } catch (e: Exception) {
            Toast.makeText(
                this,
                "Réglages Daydream introuvables. Active l'écran de veille manuellement dans Paramètres.",
                Toast.LENGTH_LONG,
            ).show()
        }

        finish()
    }
}

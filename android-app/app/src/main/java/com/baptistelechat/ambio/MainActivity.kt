package com.baptistelechat.ambio

import android.app.Activity
import android.content.ComponentName
import android.content.Intent
import android.os.Bundle
import android.widget.Toast

class MainActivity : Activity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Filet de sécurité : réassigne Ambio comme écran de veille à chaque
        // ouverture de l'app, au cas où le réglage système ait été perdu
        // (redémarrage TV, réinstallation) — voir DreamRegistrar.
        DreamRegistrar.register(this)

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

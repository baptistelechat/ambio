package com.baptistelechat.ambio

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent

/**
 * Réassigne Ambio comme écran de veille au démarrage de la TV et après
 * chaque mise à jour de l'app (voir DreamRegistrar) — évite d'avoir à
 * rouvrir l'app manuellement à chaque fois pour que ça remarche.
 */
class BootReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        DreamRegistrar.register(context)
    }
}

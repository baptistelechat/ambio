package com.baptistelechat.ambio

import android.content.ComponentName
import android.content.Context
import android.provider.Settings
import android.util.Log

/**
 * Réassigne Ambio comme écran de veille actif via Settings.Secure.
 *
 * Nécessite android.permission.WRITE_SECURE_SETTINGS — une permission
 * "signature", non demandable au runtime, qu'il faut accorder une seule fois
 * manuellement :
 *   adb shell pm grant com.baptistelechat.ambio android.permission.WRITE_SECURE_SETTINGS
 * Sans cette permission, l'appel échoue silencieusement (SecurityException
 * capturée) et il faut repasser par le sélecteur système (MainActivity →
 * réglages Daydream) pour resélectionner Ambio à la main.
 *
 * Sans ce réassignement automatique, la sélection système se perd au
 * redémarrage de la TV et surtout à chaque réinstallation de l'app en debug
 * (`adb install -r`) — ce qui explique le symptôme "il faut rouvrir l'app
 * pour que l'écran de veille remarche".
 */
object DreamRegistrar {
    private const val TAG = "DreamRegistrar"

    fun register(context: Context) {
        val component =
            ComponentName(context, MyDreamService::class.java).flattenToString()
        try {
            Settings.Secure.putString(
                context.contentResolver,
                "screensaver_components",
                component,
            )
            Settings.Secure.putInt(context.contentResolver, "screensaver_enabled", 1)
            Log.i(TAG, "Ambio réassigné comme écran de veille ($component)")
        } catch (e: SecurityException) {
            Log.w(TAG, "WRITE_SECURE_SETTINGS non accordée — réassignation impossible", e)
        }
    }
}

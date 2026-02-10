package com.arcontrol.studio.boot

/**
 * Represents the distinct initialization phases the application goes through during boot.
 * Each phase has a user-friendly message for the UI.
 */
enum class BootPhase(val message: String) {
    CORE_BOOT("CORE BOOT SEQUENCE INITIATED"),
    AUDIO_DSP("AUDIO DSP HARDENING"),
    VIDEO_ENGINE("VIDEO ENGINE SYNC"),
    AI_COPILOT("AI COPILOT VALIDATION")
}

/**
 * A sealed class representing the possible states of the application boot process.
 * This ensures a well-defined and predictable state machine for the splash UI.
 */
sealed class BootState {
    /**
     * The application is currently initializing.
     * @param progress The overall progress from 0 to 100.
     * @param phase The current initialization phase.
     */
    data class Loading(val progress: Int, val phase: BootPhase) : BootState()

    /**
     * An error occurred during a specific boot phase.
     * @param message A user-friendly error message.
     * @param phase The phase in which the error occurred.
     */
    data class Error(val message: String, val phase: BootPhase) : BootState()

    /**
     * The application has finished booting successfully and is ready to navigate to the main screen.
     */
    object Ready : BootState()
}

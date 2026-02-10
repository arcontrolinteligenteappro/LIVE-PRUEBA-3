package com.arcontrol.studio.boot

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import kotlin.random.Random

class SplashViewModel : ViewModel() {

    private val _bootState = MutableStateFlow<BootState>(BootState.Loading(0, BootPhase.CORE_BOOT))
    val bootState = _bootState.asStateFlow()

    fun startBootProcess() {
        viewModelScope.launch {
            try {
                // Initial delay to ensure splash is visible
                delay(500)

                // Phase 1: Core Boot
                simulatePhase(BootPhase.CORE_BOOT, 0, 25, 1200)

                // Phase 2: Audio DSP
                simulatePhase(BootPhase.AUDIO_DSP, 25, 55, 1500)

                // Phase 3: Video Engine
                simulatePhase(BootPhase.VIDEO_ENGINE, 55, 85, 1800)
                
                // Introduce a potential for a recoverable error for demonstration
                if (Random.nextBoolean() && bootState.value !is BootState.Ready) {
                     // In a real app, you might catch a specific exception
                     // _bootState.value = BootState.Error("Video Engine Timeout", BootPhase.VIDEO_ENGINE)
                     // return@launch
                }

                // Phase 4: AI Copilot
                simulatePhase(BootPhase.AI_COPILOT, 85, 100, 1000)

                // Final state: Ready
                delay(300) // Brief pause on 100%
                _bootState.value = BootState.Ready

            } catch (e: Exception) {
                // Global error handler
                _bootState.value = BootState.Error("Critical System Failure", BootPhase.CORE_BOOT)
            }
        }
    }

    /**
     * Simulates a boot phase by incrementally updating progress over a given duration.
     */
    private suspend fun simulatePhase(
        phase: BootPhase,
        startProgress: Int,
        endProgress: Int,
        durationMillis: Long
    ) {
        _bootState.value = BootState.Loading(startProgress, phase)
        val progressRange = endProgress - startProgress
        val stepCount = 20
        val delayPerStep = durationMillis / stepCount

        for (i in 1..stepCount) {
            delay(delayPerStep)
            val currentProgress = startProgress + ((progressRange * i) / stepCount)
            _bootState.value = BootState.Loading(currentProgress, phase)
        }
        _bootState.value = BootState.Loading(endProgress, phase)
    }
    
    fun retry() {
        // In a real scenario, you might retry a specific failed phase.
        // For this simulation, we restart the whole process.
        startBootProcess()
    }
}

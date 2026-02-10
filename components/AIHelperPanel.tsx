
import React, { useState } from 'react';
import { ProductionMode, AiSuggestion } from '../types';
import { generateTitleForName } from '../services/geminiService';
import { es } from '../localization';
import { IconAi } from './Icons';
import { Command } from './console/CommandBus';

interface AIHelperPanelProps {
    suggestions: AiSuggestion[];
    productionMode: ProductionMode;
    dispatch: (command: Command) => void;
}

const AIHelperPanel: React.FC<AIHelperPanelProps> = ({ suggestions, productionMode, dispatch }) => {
    const [activeTab, setActiveTab] = useState<'advice' | 'backgrounds' | 'voices'>('advice');
    const [isLoading, setIsLoading] = useState(false);

    const handleGetAdvice = async () => {
        setIsLoading(true);
        const prompt = "Actúa como un comentarista deportivo experto. Dame una frase corta e impactante para un momento emocionante en un partido. Sé enérgico y conciso.";
        const suggestionText = await generateTitleForName(prompt);
        if (!suggestionText.includes("Error")) {
            const newSuggestion: AiSuggestion = {
                id: `sug-${Date.now()}`,
                text: suggestionText,
            };
            dispatch({ type: 'AI_SET_SUGGESTIONS', payload: [newSuggestion, ...suggestions] });
        }
        setIsLoading(false);
    };

    const renderAdvice = () => (
        <div className="space-y-4">
            <div>
                <label className="text-sm font-semibold">{es.adviceLabel}</label>
                <button 
                    onClick={handleGetAdvice}
                    disabled={isLoading || productionMode !== ProductionMode.SPORTS}
                    className="w-full mt-2 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed"
                >
                    <IconAi className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                    <span>{es.getAdvice}</span>
                </button>
                {productionMode !== ProductionMode.SPORTS && <p className="text-xs text-yellow-400 mt-2">Esta función está optimizada para el Modo Deportivo.</p>}
            </div>
            <div className="space-y-2">
                {suggestions.map(sug => (
                    <div key={sug.id} className="p-3 bg-gray-900/50 rounded-lg text-sm italic">"{sug.text}"</div>
                ))}
            </div>
        </div>
    );
    
    const renderPlaceholders = (title: string, prompt: string) => (
         <div className="space-y-3 text-center">
            <h4 className="font-bold">{title}</h4>
            <p className="text-xs text-gray-400">Esta función no está implementada en la simulación.</p>
            <textarea className="w-full h-20 bg-gray-900 border border-gray-600 rounded-md p-2 text-sm" placeholder={prompt}></textarea>
            <button className="w-full px-4 py-2 bg-gray-600 text-white rounded-md text-sm font-semibold cursor-not-allowed">{es.generate}</button>
        </div>
    );

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">{es.aiPanelTitle}</h3>
             <div className="flex space-x-1 p-1 bg-gray-900/50 rounded-md">
                <button onClick={() => setActiveTab('advice')} className={`flex-1 p-2 text-xs font-bold rounded ${activeTab === 'advice' ? 'bg-blue-600' : ''}`}>{es.aiTabAdvice}</button>
                <button onClick={() => setActiveTab('backgrounds')} className={`flex-1 p-2 text-xs font-bold rounded ${activeTab === 'backgrounds' ? 'bg-blue-600' : ''}`}>{es.aiTabBackgrounds}</button>
                <button onClick={() => setActiveTab('voices')} className={`flex-1 p-2 text-xs font-bold rounded ${activeTab === 'voices' ? 'bg-blue-600' : ''}`}>{es.aiTabVoices}</button>
            </div>
            {activeTab === 'advice' && renderAdvice()}
            {activeTab === 'backgrounds' && renderPlaceholders("Generador de Fondos IA", es.backgroundPrompt)}
            {activeTab === 'voices' && renderPlaceholders("Generador de Voces IA", es.voicePrompt)}
        </div>
    );
};

export default AIHelperPanel;
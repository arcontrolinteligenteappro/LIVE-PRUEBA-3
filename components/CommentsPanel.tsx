
import React, { useState } from 'react';
import { Comment, CommentOverlayConfig, Overlay, OverlayType } from '../types';
import { INITIAL_COMMENTS } from '../constants';
import { IconYouTube, IconFacebook, IconTikTok } from './Icons';
import { es } from '../localization';
import { Command } from './console/CommandBus';

interface CommentsPanelProps {
    config: CommentOverlayConfig;
    dispatch: (command: Command) => void;
}

const platformIcons = {
    YouTube: <IconYouTube className="w-5 h-5 text-red-500" />,
    Facebook: <IconFacebook className="w-5 h-5 text-blue-500" />,
    TikTok: <IconTikTok className="w-5 h-5" />,
};

const CommentsPanel: React.FC<CommentsPanelProps> = ({ config, dispatch }) => {
    const [comments, setComments] = useState<Comment[]>(INITIAL_COMMENTS);
    const [hashtag, setHashtag] = useState('#ARCLS_Live');

    const handleShowComment = (comment: Comment) => {
        const overlayId = `comment-${Date.now()}`;
        const newOverlay: Overlay = {
            id: overlayId,
            type: OverlayType.COMMENT,
            content: comment,
            active: true,
        };
        dispatch({ type: 'OVERLAY_ADD', payload: newOverlay });

        setTimeout(() => {
            dispatch({ type: 'OVERLAY_REMOVE', payload: overlayId });
        }, 8000); // 8 second visibility
    };
    
    const setConfig = (newConfig: CommentOverlayConfig) => {
        dispatch({ type: 'COMMENT_CONFIG_UPDATE', payload: newConfig });
    }

    return (
        <div className="space-y-4">
            <div>
                <h3 className="text-lg font-bold text-white">{es.commentsTitle}</h3>
                <p className="text-xs text-gray-400">{es.commentsShowingFor} <span className="font-semibold text-blue-400">{hashtag}</span></p>
            </div>

            <div className="space-y-2 h-64 overflow-y-auto pr-2">
                {comments.map(comment => (
                    <div key={comment.id} className="p-2 bg-gray-700/50 rounded-lg flex space-x-3">
                        <div className="flex-shrink-0 mt-1">{platformIcons[comment.platform]}</div>
                        <div className="flex-grow">
                            <p className="font-semibold text-sm">{comment.author}</p>
                            <p className="text-xs">{comment.text}</p>
                        </div>
                        <button 
                            onClick={() => handleShowComment(comment)}
                            className="self-center px-2 py-1 bg-blue-600 text-white rounded-md text-xs font-semibold hover:bg-blue-700"
                        >{es.show}</button>
                    </div>
                ))}
            </div>

            <div>
                <h4 className="font-bold text-white mb-2">{es.commentOverlayStyle}</h4>
                 <div className="space-y-3 p-3 bg-gray-700/50 rounded-lg">
                    <div className="flex items-center justify-between">
                         <label className="text-sm font-semibold">{es.backgroundColor}</label>
                         <input 
                            type="color" 
                            value={config.backgroundColor}
                            onChange={(e) => setConfig({ ...config, backgroundColor: e.target.value })}
                            className="w-10 h-8 p-1 bg-gray-800 border border-gray-600 rounded"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-semibold">{es.opacity} ({Math.round(config.opacity * 100)}%)</label>
                        <input type="range" min="0" max="1" step="0.1" value={config.opacity} onChange={e => setConfig({...config, opacity: parseFloat(e.target.value)})} className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer" />
                    </div>
                 </div>
            </div>
        </div>
    );
};

export default CommentsPanel;
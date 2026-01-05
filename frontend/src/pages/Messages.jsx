import React, { useState, useEffect } from 'react';
import {
    MessageCircle, Send, Search, Loader2, User as UserIcon, Plus, X, Smile,
    FileText, Image, Camera, Headphones, BarChart3, Calendar, Sticker
} from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import EmojiPicker from 'emoji-picker-react';

const Messages = () => {
    const { user } = useAuth();
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [showNewConversation, setShowNewConversation] = useState(false);
    const [allUsers, setAllUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showPicker, setShowPicker] = useState(false);
    const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);
    const [fileInputAccept, setFileInputAccept] = useState('*');
    const fileInputRef = React.useRef(null);
    const attachmentMenuRef = React.useRef(null);

    // Auto-close attachment menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (attachmentMenuRef.current && !attachmentMenuRef.current.contains(event.target)) {
                setShowAttachmentMenu(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        fetchConversations();
    }, []);

    useEffect(() => {
        if (selectedConversation) {
            fetchMessages(selectedConversation._id);
        }
    }, [selectedConversation]);

    const fetchConversations = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/messages/conversations');
            setConversations(data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const fetchMessages = async (conversationId) => {
        try {
            const { data } = await api.get(`/messages/${conversationId}`);
            setMessages(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if ((!newMessage.trim() && !selectedFile) || !selectedConversation) return;

        const recipientId = selectedConversation.participants.find(
            (p) => p._id !== user._id
        )?._id;

        if (!recipientId) return;

        try {
            setSending(true);
            const formData = new FormData();
            formData.append('recipientId', recipientId);
            if (newMessage.trim()) formData.append('content', newMessage);
            if (selectedFile) formData.append('file', selectedFile);

            const { data } = await api.post('/messages', formData);
            setMessages([...messages, data]);
            setNewMessage('');
            setSelectedFile(null);
            setFilePreview(null);
            fetchConversations();
            setSending(false);
            setShowPicker(false);
        } catch (err) {
            console.error(err);
            setSending(false);
        }
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setFilePreview(reader.result);
                };
                reader.readAsDataURL(file);
            } else {
                setFilePreview(null); // No preview for non-images
            }
        }
    };

    const removeSelectedFile = () => {
        setSelectedFile(null);
        setFilePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };


    const fetchAllUsers = async () => {
        try {
            const { data } = await api.get('/users/available');
            setAllUsers(data);
        } catch (err) {
            console.error(err);
        }
    };

    const startNewConversation = (selectedUser) => {
        // Create a temporary conversation object
        const tempConversation = {
            _id: 'temp',
            participants: [user, selectedUser],
        };
        setSelectedConversation(tempConversation);
        setMessages([]);
        setShowNewConversation(false);
    };

    const getOtherParticipant = (conversation) => {
        return conversation.participants.find((p) => p._id !== user._id);
    };

    const onEmojiClick = (emojiObject) => {
        setNewMessage(prev => prev + emojiObject.emoji);
        // Do not close picker automatically for better UX
    };

    const attachmentItems = [
        { id: 'document', icon: <FileText size={22} />, label: 'Document', color: 'text-[#7f66ff]', accept: '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt' },
        { id: 'photos', icon: <Image size={22} />, label: 'Photos et vidéos', color: 'text-[#007bfc]', accept: 'image/*,video/*' },
        { id: 'camera', icon: <Camera size={22} />, label: 'Caméra', color: 'text-[#ff2e74]', accept: 'image/*' },
        { id: 'audio', icon: <Headphones size={22} />, label: 'Audio', color: 'text-[#ff7f4d]', accept: 'audio/*' },
        { id: 'contact', icon: <UserIcon size={22} />, label: 'Contact', color: 'text-[#00a3da]', action: () => alert('Partage de contact bientôt disponible') },
        { id: 'sondage', icon: <BarChart3 size={22} />, label: 'Sondage', color: 'text-[#ffbc38]', action: () => alert('Sondages bientôt disponibles') },
        { id: 'event', icon: <Calendar size={22} />, label: 'Événement', color: 'text-[#ff385c]', action: () => alert('Événements bientôt disponibles') },
        { id: 'sticker', icon: <Sticker size={22} />, label: 'Nouveau sticker', color: 'text-[#00c9a7]', action: () => alert('Stickers bientôt disponibles') },
    ];

    const handleAttachmentClick = (item) => {
        if (item.accept) {
            setFileInputAccept(item.accept);
            setTimeout(() => {
                fileInputRef.current?.click();
            }, 0);
        } else if (item.action) {
            item.action();
        }
        setShowAttachmentMenu(false);
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="w-full px-0">


            <div className="grid grid-cols-1 md:grid-cols-4 gap-0 h-[calc(100vh-160px)]">
                {/* Conversations Sidebar */}
                <div className="md:col-span-1 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="font-semibold text-gray-900 dark:text-white">Conversations</h2>
                            <button
                                onClick={() => {
                                    setShowNewConversation(true);
                                    fetchAllUsers();
                                }}
                                className="p-2 bg-primary text-white rounded-lg hover:bg-orange-600 transition-colors"
                                title="Nouvelle conversation"
                            >
                                <Plus size={18} />
                            </button>
                        </div>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Rechercher..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {conversations.length === 0 ? (
                            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                                <MessageCircle size={48} className="mx-auto mb-4 opacity-30" />
                                <p>Aucune conversation</p>
                            </div>
                        ) : (
                            conversations.map((conversation) => {
                                const otherUser = getOtherParticipant(conversation);
                                return (
                                    <div
                                        key={conversation._id}
                                        onClick={() => setSelectedConversation(conversation)}
                                        className={`p-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer transition-colors ${selectedConversation?._id === conversation._id
                                            ? 'bg-primary/10 dark:bg-primary/20'
                                            : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold shrink-0 overflow-hidden">
                                                {otherUser?.profilePicture ? (
                                                    <img
                                                        src={otherUser.profilePicture}
                                                        alt={otherUser.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    otherUser?.name?.charAt(0).toUpperCase()
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-gray-900 dark:text-white truncate">
                                                    {otherUser?.name}
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                                    {conversation.lastMessage?.content || 'Nouvelle conversation'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Messages Area */}
                <div className="md:col-span-3 bg-white dark:bg-gray-800 flex flex-col relative">
                    {selectedConversation ? (
                        <>
                            {/* Header */}
                            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold overflow-hidden">
                                    {getOtherParticipant(selectedConversation)?.profilePicture ? (
                                        <img
                                            src={getOtherParticipant(selectedConversation).profilePicture}
                                            alt={getOtherParticipant(selectedConversation).name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        getOtherParticipant(selectedConversation)?.name?.charAt(0).toUpperCase()
                                    )}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-white">
                                        {getOtherParticipant(selectedConversation)?.name}
                                    </p>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {messages.map((message) => {
                                    const isMyMessage = (message.sender._id || message.sender) === user._id;
                                    return (
                                        <div
                                            key={message._id}
                                            className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div
                                                className={`max-w-[70%] rounded-2xl px-4 py-2 ${isMyMessage
                                                    ? 'bg-primary text-white rounded-br-none'
                                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none'
                                                    }`}
                                            >
                                                {message.fileUrl && (
                                                    <div className="mt-2 mb-1">
                                                        {message.fileType?.startsWith('image/') ? (
                                                            <a href={message.fileUrl} target="_blank" rel="noopener noreferrer">
                                                                <img
                                                                    src={message.fileUrl}
                                                                    alt={message.fileName}
                                                                    className="max-w-full rounded-lg h-auto max-h-60 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                                                                />
                                                            </a>
                                                        ) : (
                                                            <a
                                                                href={message.fileUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className={`flex items-center gap-2 p-2 rounded-lg border ${isMyMessage
                                                                    ? 'bg-white/10 border-white/20 text-white'
                                                                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white'
                                                                    } hover:bg-opacity-80 transition-colors`}
                                                            >
                                                                <div className={`p-2 rounded ${isMyMessage ? 'bg-white/20' : 'bg-gray-100 dark:bg-gray-700'}`}>
                                                                    <Plus size={20} />
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="text-sm font-medium truncate">{message.fileName}</p>
                                                                    <p className="text-[10px] opacity-70">Ouvrir le fichier</p>
                                                                </div>
                                                            </a>
                                                        )}
                                                    </div>
                                                )}
                                                {message.content && <p className="break-words">{message.content}</p>}
                                                <p
                                                    className={`text-xs mt-1 ${isMyMessage ? 'text-white/70' : 'text-gray-500 dark:text-gray-400'
                                                        }`}
                                                >
                                                    {formatDistanceToNow(new Date(message.createdAt), {
                                                        addSuffix: true,
                                                        locale: fr,
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Input Area (WhatsApp Style) */}
                            <form
                                onSubmit={handleSendMessage}
                                className="p-2.5 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 flex flex-col gap-1 relative"
                            >
                                {showPicker && (
                                    <div className="absolute bottom-full left-0 mb-2 z-50">
                                        <EmojiPicker
                                            onEmojiClick={onEmojiClick}
                                            autoFocusSearch={false}
                                            theme={document.documentElement.classList.contains('dark') ? 'dark' : 'light'}
                                            width={350}
                                            height={400}
                                        />
                                    </div>
                                )}

                                {/* Attachment Menu Popover */}
                                {showAttachmentMenu && (
                                    <div
                                        ref={attachmentMenuRef}
                                        className="absolute bottom-full left-0 mb-4 w-60 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 py-2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200"
                                    >
                                        {attachmentItems.map((item) => (
                                            <button
                                                key={item.id}
                                                type="button"
                                                onClick={() => handleAttachmentClick(item)}
                                                className="w-full px-4 py-3 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
                                            >
                                                <div className={`${item.color} group-hover:scale-110 transition-transform`}>
                                                    {item.icon}
                                                </div>
                                                <span className="text-[15px] font-medium text-gray-700 dark:text-gray-200">
                                                    {item.label}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* File Preview */}
                                {selectedFile && (
                                    <div className="bg-white dark:bg-gray-800 p-2 rounded-lg mb-2 shadow-sm border border-gray-200 dark:border-gray-700 flex items-center justify-between">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            {filePreview ? (
                                                <img src={filePreview} alt="Preview" className="w-12 h-12 object-cover rounded" />
                                            ) : (
                                                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center text-gray-400">
                                                    <Plus size={20} />
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{selectedFile.name}</p>
                                                <p className="text-xs text-gray-500">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={removeSelectedFile}
                                            className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <X size={18} />
                                        </button>
                                    </div>
                                )}

                                <div className="flex items-center gap-1">
                                    <div className="flex items-center">
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleFileSelect}
                                            accept={fileInputAccept}
                                            className="hidden"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
                                            className={`p-2.5 transition-colors ${showAttachmentMenu ? 'text-primary' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                                            title="Joindre un fichier"
                                        >
                                            <Plus size={24} className={`transition-transform duration-200 ${showAttachmentMenu ? 'rotate-45' : ''}`} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setShowPicker(!showPicker)}
                                            className={`p-2.5 transition-colors ${showPicker ? 'text-primary' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                                            title="Emoji"
                                        >
                                            <Smile size={24} />
                                        </button>
                                    </div>
                                    <div className="flex-1 relative flex items-center bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700 px-1 py-1 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                                        <input
                                            type="text"
                                            value={newMessage}
                                            onFocus={() => {
                                                setShowPicker(false);
                                                setShowAttachmentMenu(false);
                                            }}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            placeholder="Écrivez votre message..."
                                            className="flex-1 bg-transparent border-none dark:text-white focus:outline-none px-3 text-[15px]"
                                        />
                                        <button
                                            type="submit"
                                            disabled={(!newMessage.trim() && !selectedFile) || sending}
                                            className="w-10 h-10 flex items-center justify-center bg-[#00a884] text-white rounded-full hover:bg-[#008f72] transition-all duration-200 disabled:opacity-50 disabled:bg-gray-400 shrink-0 shadow-sm active:scale-95"
                                        >
                                            <Send size={18} className="translate-x-0.5" />
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-gray-400 dark:text-gray-500">
                            <div className="text-center">
                                <MessageCircle size={64} className="mx-auto mb-4 opacity-30" />
                                <p className="text-lg font-medium">Sélectionnez une conversation</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* New Conversation Modal */}
            {showNewConversation && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full max-h-[80vh] overflow-hidden flex flex-col">
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                            <h2 className="text-xl font-bold dark:text-white">Nouvelle conversation</h2>
                            <button
                                onClick={() => setShowNewConversation(false)}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                <X size={20} className="text-gray-600 dark:text-gray-400" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4">
                            {allUsers.length === 0 ? (
                                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                    <UserIcon size={48} className="mx-auto mb-4 opacity-30" />
                                    <p className="font-medium mb-2">Aucun utilisateur disponible</p>
                                    <p className="text-sm">Il n'y a pas encore d'autres utilisateurs sur la plateforme.</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {allUsers.map((u) => (
                                        <div
                                            key={u._id}
                                            onClick={() => startNewConversation(u)}
                                            className="p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors flex items-center gap-3"
                                        >
                                            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold shrink-0 overflow-hidden">
                                                {u.profilePicture ? (
                                                    <img
                                                        src={u.profilePicture}
                                                        alt={u.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    u.name.charAt(0).toUpperCase()
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <p className="font-semibold text-gray-900 dark:text-white">{u.name}</p>
                                                    {u.isAdmin && (
                                                        <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-bold rounded-full">
                                                            Admin
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">{u.email}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Messages;

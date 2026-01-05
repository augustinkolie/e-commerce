import React, { useState, useEffect, useCallback } from 'react';
import { Star, User, ThumbsUp, Reply, Send, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const ReviewSection = ({ productId, onReviewAdded }) => {
    const { user } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submitError, setSubmitError] = useState(null);
    const [hover, setHover] = useState(null);

    // Reply state
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyComment, setReplyComment] = useState('');
    const [isSubmittingReply, setIsSubmittingReply] = useState(false);

    const fetchReviews = useCallback(async (silent = false) => {
        try {
            if (!silent) setLoading(true);
            const { data } = await api.get(`/products/${productId}/reviews`);
            if (Array.isArray(data)) {
                setReviews(data);
            } else {
                setReviews([]);
            }
            if (!silent) setLoading(false);
        } catch (err) {
            setError('Impossible de charger les commentaires.');
            setReviews([]);
            if (!silent) setLoading(false);
        }
    }, [productId]);

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError(null);
        try {
            await api.post(`/products/${productId}/reviews`, {
                rating,
                comment,
            });
            setComment('');
            setRating(5);
            fetchReviews(true); // Silent update after adding review
            if (onReviewAdded) onReviewAdded();
        } catch (err) {
            setSubmitError(err.response?.data?.message || err.message);
        }
    };

    const handleLike = async (reviewId) => {
        if (!user) return;

        // Optimistic UI Update
        const updatedReviews = reviews.map(review => {
            if (review._id === reviewId) {
                const alreadyLiked = review.likes?.includes(user._id);
                const newLikes = alreadyLiked
                    ? review.likes.filter(id => id !== user._id)
                    : [...(review.likes || []), user._id];
                return { ...review, likes: newLikes };
            }
            return review;
        });
        setReviews(updatedReviews);

        try {
            await api.put(`/products/${productId}/reviews/${reviewId}/like`);
            // We refresh silently to sync with server state (names, etc)
            // but the UI already looks updated
            fetchReviews(true);
        } catch (err) {
            // Revert on error
            fetchReviews(true);
            console.error(err.response?.data?.message || err.message);
        }
    };

    const handleReplyLike = async (reviewId, replyId) => {
        if (!user) return;

        // Optimistic UI Update
        const updatedReviews = reviews.map(review => {
            if (review._id === reviewId) {
                const updatedReplies = review.replies.map(reply => {
                    if (reply._id === replyId) {
                        const alreadyLiked = reply.likes?.includes(user._id);
                        const newLikes = alreadyLiked
                            ? reply.likes.filter(id => id !== user._id)
                            : [...(reply.likes || []), user._id];
                        return { ...reply, likes: newLikes };
                    }
                    return reply;
                });
                return { ...review, replies: updatedReplies };
            }
            return review;
        });
        setReviews(updatedReviews);

        try {
            await api.put(`/products/${productId}/reviews/${reviewId}/replies/${replyId}/like`);
            fetchReviews(true);
        } catch (err) {
            fetchReviews(true);
            console.error(err.response?.data?.message || err.message);
        }
    };

    const handleReply = async (reviewId) => {
        if (!user || !replyComment) return;

        setIsSubmittingReply(true);
        const currentReplyComment = replyComment;

        // Optimistic UI for Reply (Temporary placeholder)
        const tempReply = {
            _id: 'temp-' + Date.now(),
            user: user._id,
            name: user.name,
            comment: currentReplyComment,
            likes: [],
            createdAt: new Date().toISOString(),
            isTemporary: true
        };

        const updatedReviews = reviews.map(review => {
            if (review._id === reviewId) {
                return { ...review, replies: [...(review.replies || []), tempReply] };
            }
            return review;
        });
        setReviews(updatedReviews);
        setReplyComment('');
        setReplyingTo(null);

        try {
            await api.post(`/products/${productId}/reviews/${reviewId}/reply`, {
                comment: currentReplyComment
            });
            fetchReviews(true);
        } catch (err) {
            fetchReviews(true); // Redo full fetch to clean up the UI
            console.error(err.response?.data?.message || err.message);
        } finally {
            setIsSubmittingReply(false);
        }
    };

    const isMyComment = (commentUser) => user && user._id === (commentUser._id || commentUser);

    return (
        <div className="space-y-8">
            <h3 className="text-2xl font-bold dark:text-white">Commentaires Clients</h3>

            {/* List Reviews */}
            <div className="space-y-6">
                {loading && reviews.length === 0 ? (
                    <p className="text-gray-500">Chargement des commentaires...</p>
                ) : reviews.length === 0 ? (
                    <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-2xl text-center">
                        <p className="text-gray-500 dark:text-gray-400">Aucun commentaire pour le moment. Soyez le premier à donner votre avis !</p>
                    </div>
                ) : (
                    reviews.map((review) => (
                        <div key={review._id} className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm transition-all hover:border-gray-200 dark:hover:border-gray-600">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-gray-600">
                                        <User size={20} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="font-bold dark:text-white">{review.name}</p>
                                            {isMyComment(review.user) && (
                                                <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Moi</span>
                                            )}
                                        </div>
                                        <div className="flex text-yellow-400 text-sm">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={14} className={i < review.rating ? 'fill-current' : 'text-gray-300 dark:text-gray-600'} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <span className="text-xs text-gray-400">
                                    {review.createdAt ? format(new Date(review.createdAt), 'dd MMMM yyyy', { locale: fr }) : ''}
                                </span>
                            </div>

                            <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">{review.comment}</p>

                            {/* Actions: Like & Reply */}
                            <div className="flex items-center gap-6 border-t border-gray-50 dark:border-gray-700/50 pt-4">
                                <button
                                    onClick={() => handleLike(review._id)}
                                    disabled={!user || isMyComment(review.user)}
                                    className={`flex items-center gap-2 text-sm font-semibold transition-all group ${user && review.likes?.includes(user._id)
                                            ? 'text-primary'
                                            : isMyComment(review.user)
                                                ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                                                : 'text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary'
                                        }`}
                                >
                                    <ThumbsUp size={16} className={`group-active:scale-125 transition-transform ${user && review.likes?.includes(user._id) ? 'fill-current' : ''}`} />
                                    <span>{review.likes?.length || 0}</span>
                                </button>

                                <button
                                    onClick={() => setReplyingTo(replyingTo === review._id ? null : review._id)}
                                    disabled={!user || isMyComment(review.user)}
                                    className={`flex items-center gap-2 text-sm font-semibold transition-all ${replyingTo === review._id
                                            ? 'text-primary'
                                            : isMyComment(review.user)
                                                ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                                                : 'text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary'
                                        }`}
                                >
                                    <Reply size={16} />
                                    <span>Répondre</span>
                                </button>
                            </div>

                            {/* Reply Input */}
                            {replyingTo === review._id && (
                                <div className="mt-4 flex gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-400 flex-shrink-0">
                                        <User size={16} />
                                    </div>
                                    <div className="flex-1 relative">
                                        <textarea
                                            value={replyComment}
                                            onChange={(e) => setReplyComment(e.target.value)}
                                            placeholder="Votre réponse..."
                                            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none dark:text-white transition-all resize-none pr-12"
                                            rows="2"
                                            autoFocus
                                        />
                                        <button
                                            onClick={() => handleReply(review._id)}
                                            disabled={isSubmittingReply || !replyComment}
                                            className="absolute right-2 bottom-2 p-1.5 bg-primary hover:bg-orange-600 text-white rounded-xl transition-all disabled:opacity-50 disabled:bg-gray-400"
                                        >
                                            {isSubmittingReply ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Nested Replies */}
                            {review.replies?.length > 0 && (
                                <div className="mt-6 ml-4 pl-6 border-l-2 border-gray-50 dark:border-gray-700/50 space-y-6">
                                    {review.replies.map((reply, idx) => (
                                        <div key={reply._id || idx} className={`group ${reply.isTemporary ? 'opacity-70' : ''}`}>
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-400 border border-gray-100 dark:border-gray-700">
                                                        <User size={16} />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <p className="text-xs font-bold dark:text-white">{reply.name}</p>
                                                            {isMyComment(reply.user) && (
                                                                <span className="text-[8px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-bold uppercase">Moi</span>
                                                            )}
                                                        </div>
                                                        <p className="text-[10px] text-gray-400">
                                                            {reply.createdAt ? format(new Date(reply.createdAt), 'dd MMM yyyy', { locale: fr }) : ''}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 pl-10 mb-2">{reply.comment}</p>

                                            {/* Reply Actions: Like only */}
                                            <div className="pl-10 flex gap-4">
                                                <button
                                                    onClick={() => handleReplyLike(review._id, reply._id)}
                                                    disabled={!user || isMyComment(reply.user) || reply.isTemporary}
                                                    className={`flex items-center gap-1.5 text-xs font-semibold transition-all group ${user && reply.likes?.includes(user._id)
                                                            ? 'text-primary'
                                                            : isMyComment(reply.user)
                                                                ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                                                                : 'text-gray-400 hover:text-primary dark:text-gray-500 dark:hover:text-primary'
                                                        }`}
                                                >
                                                    <ThumbsUp size={12} className={`group-active:scale-125 transition-transform ${user && reply.likes?.includes(user._id) ? 'fill-current' : ''}`} />
                                                    <span>{reply.likes?.length || 0}</span>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Add Review Form */}
            {user ? (
                <div className="bg-gray-50 dark:bg-gray-800/50 p-6 md:p-8 rounded-3xl border border-gray-200 dark:border-gray-700 mt-12">
                    <h4 className="text-xl font-bold dark:text-white mb-6">Écrire un commentaire</h4>
                    {submitError && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm flex items-center gap-2 border border-red-100">
                            <span className="w-1 h-1 rounded-full bg-red-600"></span>
                            {submitError}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Votre Note</label>
                            <div className="flex gap-2">
                                {[...Array(5)].map((_, i) => {
                                    const ratingValue = i + 1;
                                    return (
                                        <button
                                            key={i}
                                            type="button"
                                            className="focus:outline-none transition-all hover:scale-110 active:scale-90"
                                            onClick={() => setRating(ratingValue)}
                                            onMouseEnter={() => setHover(ratingValue)}
                                            onMouseLeave={() => setHover(null)}
                                        >
                                            <Star
                                                size={32}
                                                className={`transition-colors ${ratingValue <= (hover || rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                                            />
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Votre Commentaire</label>
                            <textarea
                                rows="4"
                                className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none dark:text-white transition-all shadow-sm placeholder:text-gray-400"
                                placeholder="Partagez votre expérience avec ce produit..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                required
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            className="bg-primary hover:bg-orange-600 text-white font-bold py-4 px-10 rounded-2xl transition-all shadow-lg shadow-orange-500/20 active:scale-95 flex items-center gap-2"
                        >
                            Publier le commentaire
                        </button>
                    </form>
                </div>
            ) : (
                <div className="bg-orange-50 dark:bg-orange-900/10 p-6 rounded-2xl text-center border border-orange-100 dark:border-orange-900/30">
                    <p className="text-gray-700 dark:text-gray-300 flex items-center justify-center gap-2">
                        Veuillez vous <a href="/login" className="font-bold text-primary hover:underline">connecter</a> pour laisser un commentaire.
                    </p>
                </div>
            )}
        </div>
    );
};

export default ReviewSection;

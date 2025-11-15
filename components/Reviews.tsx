"use client";
import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { Star, UserCircle } from 'lucide-react';

// Tipuri de date
type Review = {
  id: string;
  rating: number;
  title?: string;
  content: string;
  createdAt: string;
  user: {
    name?: string | null;
    image?: string | null;
  };
};

// Componentă pentru afișarea stelelor
const StarRating = ({ rating, size = "md" }: { rating: number; size?: "sm" | "md" }) => (
  <div className="flex items-center">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`
          ${rating > i ? 'text-yellow-400' : 'text-gray-300'}
          ${size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'}
        `}
        fill="currentColor"
      />
    ))}
  </div>
);


// Componenta principală pentru Recenzii
export default function Reviews({ productSlug }: { productSlug: string }) {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Starea pentru formularul de adăugare
  const [newReviewRating, setNewReviewRating] = useState(0);
  const [newReviewTitle, setNewReviewTitle] = useState('');
  const [newReviewContent, setNewReviewContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/reviews?productSlug=${productSlug}`);
      if (!res.ok) throw new Error('Nu am putut încărca recenziile.');
      const data = await res.json();
      setReviews(data.reviews);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [productSlug]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newReviewRating === 0 || newReviewContent.trim() === '') {
        setFormError("Rating-ul și conținutul sunt obligatorii.");
        return;
    }
    setSubmitting(true);
    setFormError(null);

    try {
        const res = await fetch('/api/reviews', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                productSlug,
                rating: newReviewRating,
                title: newReviewTitle,
                content: newReviewContent,
            }),
        });

        if (!res.ok) {
            const data = await res.json();
            throw new Error(data.error || "A apărut o eroare la trimitere.");
        }
        
        // Reset form & reload reviews
        setNewReviewRating(0);
        setNewReviewTitle('');
        setNewReviewContent('');
        await fetchReviews();

    } catch(err: any) {
        setFormError(err.message);
    } finally {
        setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Formular de adăugare recenzie (doar pentru useri logați) */}
      {session?.user && (
        <form onSubmit={handleSubmit} className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h3 className="font-semibold mb-2">Adaugă o recenzie</h3>
          <div className="space-y-3">
            <div>
                <label className="field-label">Rating</label>
                <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                        <button type="button" key={i} onClick={() => setNewReviewRating(i + 1)}>
                            <Star className={`w-6 h-6 transition-colors ${newReviewRating > i ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300'}`} fill="currentColor" />
                        </button>
                    ))}
                </div>
            </div>
             <input type="text" value={newReviewTitle} onChange={(e) => setNewReviewTitle(e.target.value)} placeholder="Titlu recenzie (opțional)" className="input w-full"/>
            <textarea value={newReviewContent} onChange={(e) => setNewReviewContent(e.target.value)} placeholder="Scrie recenzia ta aici..." rows={4} className="input w-full" required />
            {formError && <p className="text-sm text-red-600">{formError}</p>}
            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting ? 'Se trimite...' : 'Trimite recenzia'}
            </button>
          </div>
        </form>
      )}

      {/* Lista de recenzii */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Ce spun clienții</h3>
        {loading ? <p>Se încarcă recenziile...</p> : 
         error ? <p className="text-red-600">{error}</p> :
         reviews.length === 0 ? <p className="text-gray-500">Nu sunt recenzii pentru acest produs încă. Fii primul!</p> :
         (
            <ul className="space-y-6">
                {reviews.map(review => (
                    <li key={review.id} className="border-b border-gray-200 pb-6">
                        <div className="flex items-start gap-3">
                            {review.user.image ? <img src={review.user.image} alt={review.user.name || ''} className="w-10 h-10 rounded-full" /> : <UserCircle className="w-10 h-10 text-gray-400" />}
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold">{review.user.name || "Anonim"}</span>
                                    <span className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString('ro-RO')}</span>
                                </div>
                                <StarRating rating={review.rating} size="sm" />
                            </div>
                        </div>
                        <div className="mt-3">
                            {review.title && <h4 className="font-semibold mb-1">{review.title}</h4>}
                            <p className="text-sm text-gray-600">{review.content}</p>
                        </div>
                    </li>
                ))}
            </ul>
         )
        }
      </div>
    </div>
  );
}

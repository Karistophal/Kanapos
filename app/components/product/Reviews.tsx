
import React, { useEffect, useState } from "react";

import ReviewStars from "@/app/components/inputs/ReviewStars";

import Hr from "@/app/components/Hr";

import { useRouter } from "next/navigation";

import getReviews from "@/app/actions/getReviews";
import { Review } from "@prisma/client";


interface ReviewWithUser extends Review {
    user: {
        name: string | null;
        email: string;
        createdAt: Date;
    }
}
interface ReviewsProps {
    productId: string;
}

const Reviews: React.FC<ReviewsProps> = ({ 
    productId
}) => {

    const router = useRouter();

    const [reviews, setReviews] = useState<ReviewWithUser[]>();
    const [reviewsNumber, setReviewsNumber] = useState<number>(1);
    const [reviewOrder, setReviewOrder] = useState<string>('best');

    useEffect(() => {
        const fetchReviews = async () => {
            const reviews = await getReviews(productId, reviewOrder, reviewsNumber);
            setReviews(reviews);
        }
        fetchReviews();
    }, []);
    
    async function handleReviewRefresh(e: React.ChangeEvent<HTMLSelectElement>) {
        setReviewOrder(e.target.value);
        const newReviews: ReviewWithUser[] = await getReviews(productId, e.target.value, reviewsNumber);
        setReviews(newReviews);
        router.refresh();
    }

    const handleViewMore = async () => {
        const newReviews: ReviewWithUser[] = await getReviews(productId, reviewOrder, reviewsNumber + 2);
        setReviews(newReviews);
        setReviewsNumber(reviewsNumber + 2);
    }

    //Calcul de la date
    const timeAgo = (date: string) => {
        const now = new Date();
        const givenDate = new Date(date);

        const diffInSeconds = Math.floor((now.getTime() - givenDate.getTime()) / 1000);
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        const diffInHours = Math.floor(diffInMinutes / 60);
        const diffInDays = Math.floor(diffInHours / 24);
        const diffInMonths = Math.floor(diffInDays / 30);
        const diffInYears = Math.floor(diffInMonths / 12);

        if (diffInDays < 1) {
            if (diffInHours < 1) {
                return 'Maintenant'
            }
            return `Il y a ${diffInHours} heure${diffInHours > 1 ? 's' : ''}`;
        } else if (diffInDays < 30) {
            return `Il y a ${diffInDays} jour${diffInDays > 1 ? 's' : ''}`;
        } else if (diffInMonths < 12) {
            return `Il y a ${diffInMonths} mois`;
        } else {
            return `Il y a ${diffInYears} an${diffInYears > 1 ? 's' : ''}`;
        }
    }


    return (
        <div className="flex flex-col gap-4 w-full pb-3 pt-5 sm:py-10 px-3  xl:px-32 bg-gray-200 rounded-3xl">
            <h1 className="sm:text-3xl text-2xl mb-5 font-bold text-center">Avis clients</h1>
            <div className="flex gap-2 justify-end items-center">
                <div className="">Trier par :</div>
                <select className="bg-gray-50 rounded-full font-semibold p-2 px-5 select" onChange={handleReviewRefresh} defaultValue="best" >
                    <option value="best">Meilleur avis</option>
                    <option value="worst">Pire avis</option>
                    <option value="newest">Plus récent</option>
                    <option value="oldest">Plus ancien</option>
                </select>
            </div>
            {reviews ? (
            <div className="bg-gray-50 rounded-3xl p-4 sm:p-10 flex flex-col gap-4">
                {reviews.length > 0 ? (
                    reviews.map((review, index) => (
                        <div key={index} className="flex flex-col gap-1">
                            <div className="flex justify-between w-full gap-8">
                                <div className="flex flex-col sm:flex-row sm:gap-2 sm:items-center">
                                    <p className="text-dark text-lg sm:text-2xl font-bold">{review.user.name}</p>
                                    <p className="text-gray-500 text-md">{timeAgo(review.createdAt.toString())}</p>
                                </div>
                                <ReviewStars reviews={[review]} size={18} />
                            </div>

                            <div className="mx-2 sm:mx-4 my-2">
                                <p className="text-dark text-lg sm:text-xl font-bold ">{review.title}</p>
                                <p className="text-gray-500 text-md sm:text-lg">{review.comment}</p>
                            </div>
                            {index < reviews.length - 1 && <Hr />}
                        </div>
                    ))
                ) : (
                    <div className="text-center text-gray-500 text-lg sm:text-xl font-bold">Il n&apos;y a aucun avis</div>
                )}
                {reviews.length !== 0 && (
                    <div className=" text-md sm:text-lg flex justify-center cursor-pointer text-gray-500 font-semibold text-lg"
                        onClick={handleViewMore}
                    >Voir plus...</div>
                )}
            </div>
            ) : (
                <div className="flex justify-center items-center w-full h-full">
                    <div className="text-xl">Chargement...</div>
                </div>
            )}
        </div>
    );
}

export default Reviews;
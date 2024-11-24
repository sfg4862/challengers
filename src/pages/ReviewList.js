import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './ReviewList.module.css';
import host from "../api";

const ReviewList = () => {
    const navigate = useNavigate();
    const [reviewList, setReviewList] = useState([]);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await axios.get(`${host}review/list`, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (Array.isArray(response.data.result)) {
                    setReviewList(response.data.result);
                } else {
                    console.error("Fetched data is not an array:", response.data);
                    setReviewList([]);
                }
            } catch (error) {
                console.error("Error fetching challenges:", error);
                setReviewList([]);
            }
        };

        fetchReviews();
    }, []);



    return (
        <div className={styles.ReviewsPage}>
            <div className={styles.review}>
                <h1>수많은 리뷰를 만나보세요!</h1>
            </div>
            <div className={styles.reviewsGrid}>
                {reviewList
                    .map((review, index) => (
                        <div
                            key={index}
                            className={styles.reviewCard}
                        >
                            <div>
                                <span className={styles.nickname}>{review.nickName} 작성</span>
                            </div>
                            <div>
                                <h3 className={styles.reviewTitle}>{review.description}</h3>
                            </div>
                            <div>
                                <p className={styles.reviewContent}>{review.content}</p>
                            </div>
                        </div>

                    ))}
            </div>

        </div>
    );
};

export default ReviewList;
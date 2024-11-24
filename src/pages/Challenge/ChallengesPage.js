import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './ChallengesPage.module.css';
import host from "../../api";

const ChallengesPage = () => {
    const navigate = useNavigate();
    const [challengeList, setChallengeList] = useState([]);
    const token = localStorage.getItem('auth-token');

    useEffect(() => {
        const fetchChallenges = async () => {
            try {
                const response = await axios.get(`${host}challenge/list`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': token,
                    }
                });

                if (Array.isArray(response.data.result)) {
                    setChallengeList(response.data.result);
                } else {
                    console.error("Fetched data is not an array:", response.data);
                    setChallengeList([]);
                }
            } catch (error) {
                console.error("Error fetching challenges:", error);
                setChallengeList([]);
            }
        };

        fetchChallenges();
    }, []);

    const handleCardClick = (challengeId) => {
        navigate(`/challenge/${challengeId}`);
    };

    const handleCreateChallenge = () => {
        navigate('/create-challenge');
    };

    return (
        <div className={styles.challengesPage}>
            <div className={styles.challenge}>
                <h1>도전 목록</h1>
                <button
                    className={styles.createChallengeButton}
                    onClick={handleCreateChallenge}
                >
                    도전 생성
                </button>
            </div>
            <div className={styles.challengesGrid}>
                {challengeList
                    .filter(challenge => challenge.status === 0)
                    .map((challenge) => (
                        <div
                            key={challenge.challengeId}
                            className={styles.challengeCard}
                            onClick={() => handleCardClick(challenge.challengeId)}
                        >
                            <div
                                className={`${styles.challengeBadge} ${challenge.status ? styles.inProgress : styles.recruiting}`}>
                                <span>{challenge.status ? "진행 중" : "모집 중"}</span>
                            </div>
                            <h3 className={styles.challengeTitle}>
                                {challenge.description || "도전 제목"}
                            </h3>
                            <div className={styles.challengeDates}>
                                진행 단계: {challenge.currentStep} / {challenge.totalStep}
                            </div>
                            <div className={styles.challengeDetails}>
                                <p>참여 인원: {challenge.userCount} / {challenge.maxHead}</p>
                            </div>
                            <div className={styles.challengeRewards}>
                                <p>{challenge.status === 0
                                    ? "참여비"
                                    : "보상금"}</p>
                                <span>
                                {challenge.status === 0
                                    ? `${challenge.participationFee ? challenge.participationFee.toLocaleString() : "0"}원`
                                    : `${challenge.reward ? challenge.reward.toLocaleString() : "보증금 없음"}원`}
                            </span>
                            </div>
                        </div>

                    ))}
            </div>
            <div className={styles.challengesGrid}>
                {challengeList
                    .filter(challenge => challenge.status === 1)
                    .map((challenge) => (
                        <div
                            key={challenge.challengeId}
                            className={styles.challengeCard}
                            onClick={() => handleCardClick(challenge.challengeId)}
                        >
                            <div
                                className={`${styles.challengeBadge} ${challenge.status ? styles.inProgress : styles.recruiting}`}>
                                <span>{challenge.status ? "진행 중" : "모집 중"}</span>
                            </div>
                            <h3 className={styles.challengeTitle}>
                                {challenge.description || "도전 제목"}
                            </h3>
                            <div className={styles.challengeDates}>
                                진행 단계: {challenge.currentStep} / {challenge.totalStep}
                            </div>
                            <div className={styles.challengeDetails}>
                                <p>참여 인원: {challenge.userCount} / {challenge.maxHead}</p>
                            </div>
                            <div className={styles.challengeRewards}>
                                <p>{challenge.status === 0
                                    ? "참여비"
                                    : "보상금"}</p>
                                <span>
                                {challenge.status === 0
                                    ? `${challenge.participationFee ? challenge.participationFee.toLocaleString() : "0"}원`
                                    : `${challenge.reward ? challenge.reward.toLocaleString() : "보증금 없음"}원`}
                            </span>
                            </div>
                        </div>

                    ))}
            </div>
            <div className={styles.challengesGrid}>
                {challengeList
                    .filter(challenge => challenge.status === 2)
                    .map((challenge) => (
                        <div
                            key={challenge.challengeId}
                            className={styles.challengeCard}
                            onClick={() => handleCardClick(challenge.challengeId)}
                        >
                            <div
                                className={`${styles.challengeBadge} ${styles.ended}`}>
                                <span>종료된 도전</span>
                            </div>
                            <h3 className={styles.challengeTitle}>
                                {challenge.description || "도전 제목"}
                            </h3>
                            <div className={styles.challengeDates}>
                                진행 단계: {challenge.currentStep} / {challenge.totalStep}
                            </div>
                            <div className={styles.challengeDetails}>
                                <p>참여 인원: {challenge.userCount} / {challenge.maxHead}</p>
                            </div>
                            <div className={styles.challengeRewards}>
                                <p>{challenge.status === 0
                                    ? "참여비"
                                    : "보상금"}</p>
                                <span>
                                {challenge.status === 0
                                    ? `${challenge.participationFee ? challenge.participationFee.toLocaleString() : "0"}원`
                                    : `${challenge.reward ? challenge.reward.toLocaleString() : "보증금 없음"}원`}
                            </span>
                            </div>
                        </div>

                    ))}
            </div>
        </div>
    );
};

export default ChallengesPage;
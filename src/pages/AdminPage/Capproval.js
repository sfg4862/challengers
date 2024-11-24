import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Capproval.module.css';
import host from "../../api";
import axios from "axios";

const ChallengeApproval = () => {
    const [challengeList, setChallengeList] = useState([]);
    const token = localStorage.getItem('auth-token');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchChallenge = async () => {
            try {
                const response = await axios.get(`${host}admin/challengeauth/list`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': token,
                    }
                });
                const mappedChallenge = response.data.result.map(challenge => {
                    const date = new Date(challenge.createdAt);
                    const formattedDate = `${date.getMonth() + 1}.${date.getDate()}`;
                    return {
                        id: challenge.id,
                        contents: challenge.contents,
                        description: challenge.description,
                        nickname: challenge.nickname,
                        createdAt: formattedDate,
                        stepsId: challenge.stepsId
                    };
                });
                setChallengeList(mappedChallenge);
            } catch (error) {
                console.error("도전 목록을 가져오는 중 오류 발생:", error);
            }
        };
        fetchChallenge();
    }, [token]);

    const handleCardClick = (cAuthId) => {
        navigate(`/adminauth/${cAuthId}`);
    };

    return (
        <div className={styles.adminSection}>
            <h2>도전 인증 대기 목록</h2>
            <div className={styles.coursesGrid}>
                {challengeList.map((challenge) => (
                    <div
                        key={challenge.id}
                        className={styles.courseCard}
                        onClick={() => handleCardClick(challenge.id)}
                    >
                        <div className={styles.courseBadge}>
                            닉네임: <span>{challenge.nickname}</span>
                        </div>
                        <h3 className={styles.courseTitle}>
                            {challenge.description || '도전 제목 없음'}
                        </h3>
                        <div className={styles.courseDates}>
                            <p>{challenge.stepsId}단계</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ChallengeApproval;

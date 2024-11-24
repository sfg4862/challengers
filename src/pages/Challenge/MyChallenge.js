import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styles from './MyChallenge.module.css';
import host from "../../api";

const MyChallenges = () => {
    const [myChallenges, setMyChallenges] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('auth-token');

    useEffect(() => {
        const fetchMyChallenges = async () => {
            try {
                const response = await axios.get(`${host}challenge/user`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': token,
                    }
                });

                setMyChallenges(response.data.result);
            } catch (error) {
                console.error("Error fetching enrolled challenges:", error);
                alert("신청한 도전이 없거나 불러오는 데 실패했습니다.");
            }
            finally {
                setLoading(false);
            }
        };
        fetchMyChallenges();
    }, []);

    if (loading) return <p>Loading...</p>;

    return (

            <div className={styles.myChallenges}>
                <div>
                <h2 className={styles.title}>나의 도전</h2>
                {myChallenges.length === 0 ? (
                    <p>신청한 도전이 없습니다.</p>
                ) : (
                    <ul className={styles.list}>
                        {myChallenges
                            .sort((a, b) => {
                                // status 값 기준으로 정렬
                                const order = {1: 0, 0: 1, 2: 2}; // 원하는 순서로 매핑
                                return order[a.status] - order[b.status];
                            })
                            .map(challenge => (
                                <li key={challenge.id} className={styles.listItem}>
                                    <Link
                                        to={`/mychallenge/${challenge.challengeId}`}
                                    >
                                        <h3 className={styles.itemTitle}>{challenge.description}</h3>
                                        <p className={styles.itemDescription}>
                                            상태:{" "}
                                            {challenge.status === 0
                                                ? "진행전"
                                                : challenge.status === 1
                                                    ? <strong style={{
                                                        backgroundColor: "#696969",
                                                        padding: "4px",
                                                        borderRadius: "6px",
                                                        color: "white"
                                                    }}>진행중</strong>
                                                    : challenge.status === 2
                                                        ? "종료"
                                                        : "알수없음"}
                                        </p>
                                        <p className={styles.itemDescription}>
                                            진행 단계: {challenge.currentStep} / {challenge.totalStep}
                                        </p>
                                        <p className={styles.itemDescription}>
                                            참여 인원: {challenge.userCount} / {challenge.maxHead}
                                        </p>
                                        <p className={styles.itemDescription}>총 보상금: {challenge.reward}</p>
                                    </Link>
                                </li>
                            ))}
                    </ul>
                )}
                </div>
            </div>

    );
};

export default MyChallenges;

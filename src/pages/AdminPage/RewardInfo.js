import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import host from "../../api";
import styles from "./RewardInfo.module.css";

const RewardInfo = () => {
    const [challengeData, setChallengeData] = useState(null); // 챌린지 데이터
    const [userData, setUserData] = useState(null);
    const token = localStorage.getItem("auth-token");
    const { id } = useParams();

    const fetchChallengeData = async () => {
        try {
            const response = await axios.get(`${host}admin/reward/${id}`, {
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": token,
                },
            });
            setChallengeData(response.data.challengeInfo);
            setUserData(response.data.usersList);
        } catch (error) {
            console.error("Error fetching challenge data:", error);
        }
    };

    const postChallengeData = async () => {
        try {
            await axios.post(
                `${host}admin/reward`,
                { challengeId: id, isAccept: 1 },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "auth-token": token,
                    }
                }
            );
            alert("지급 요청이 완료되었습니다!");
        } catch (error) {
            console.error("Error posting challenge data:", error);
        }
    };

    useEffect(() => {
        fetchChallengeData();
    }, [id]);

    return (
        <div className={styles["minfo-container"]}>
            {/* 챌린지 정보 */}
            <div className={styles["challenge-info"]}>
                <h2>도전 보상 지급 관리</h2>
                {challengeData ? (
                    <div style={{textAlign: "left"}}>
                        <p><strong>도전이름</strong>: {challengeData.description}</p>
                        <p><strong>총 단계</strong>: {challengeData.totalStep} 단계</p>
                        <p><strong>총 참여자</strong>: {challengeData.userCount} 명</p>
                        <p><strong>총 보상금</strong>: {challengeData.reward} 원</p>
                        <p><strong>인당 지급액</strong>: {challengeData.reward_per_user} 원</p>
                    </div>
                ) : (
                    <p>로딩 중...</p>
                )}
            </div>

            {/* 등록 명단 */}
            <div className={styles["participants-container"]}>
                <h3>성공자 명단</h3>
                {console.log(userData)}
                {userData && userData.length > 0 ? (
                    <ul>
                        {userData.map((user, index) => (
                            <li key={index}>{index + 1}. {user.nickName}</li>
                        ))}
                    </ul>
                ) : (
                    <p>성공자가 없습니다.</p>
                )}
            </div>

            {/* 버튼 */}
            <div className={styles["button-container"]}>
                <button onClick={postChallengeData} className={styles["approveButton"]}>
                    지급
                </button>
            </div>
        </div>
    );
};

export default RewardInfo;

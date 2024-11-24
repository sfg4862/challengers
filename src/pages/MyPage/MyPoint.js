import React, { useEffect, useState } from 'react';
import PointHistory from "./PointHistory";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import host from "../../api";
import styles from "./MyPoint.module.css";

const MyPoint = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('auth-token');
    const [accountData, setAccountData] = useState(null); // 초기값 null
    const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가

    useEffect(() => {
        const fetchAccount = async () => {
            try {
                const response = await axios.get(`${host}finance/`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': token,
                    }
                });

                // 계좌 데이터가 없을 경우 null로 설정
                if (response.data.result && response.data.result.length > 0) {
                    setAccountData(response.data.result[0]);
                } else {
                    setAccountData(null);
                }
            } catch (error) {
                console.error("Error getting account data:", error);
                setAccountData(null); // 에러 발생 시에도 null로 설정
            } finally {
                setIsLoading(false); // 로딩 완료
            }
        };

        fetchAccount();
    }, [token]);

    const handleDeleteAccount = async () => {
        if (!accountData) {
            alert("삭제할 계좌가 없습니다.");
            return;
        }

        try {
            await axios.delete(`${host}finance/${accountData.id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token,
                }
            });
            alert("계좌가 삭제되었습니다.");
            setAccountData(null);
        } catch (error) {
            console.error("Error deleting account data:", error);
            alert("계좌 삭제에 실패했습니다.");
        }
    };

    return (
        <div>
            <div className={styles.group}>
                <button onClick={() => navigate('/mypage/pointexchange')} className={styles.xchange}>포인트 환전</button>
                <button onClick={() => navigate('/mypage/pointrecharge')} className={styles.charge}>포인트 충전</button>
                <button onClick={() => navigate('/mypage/account')} className={styles.register}>계좌번호 등록</button>
                <button onClick={handleDeleteAccount} className={styles.delete}>계좌 삭제</button>

                {/* 항상 "등록된 계좌가 없습니다."를 표시 */}
                {!isLoading && (
                    accountData ? (
                        <p className={styles.pp}>내 계좌: {accountData.bankName} {accountData.accountNumber}</p>
                    ) : (
                        <p>등록된 계좌가 없습니다.</p>
                    )
                )}
            </div>
            <hr className={styles.dividerLine} />
            <PointHistory />
        </div>
    );
};

export default MyPoint;
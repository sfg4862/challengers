import React, { useState } from 'react';
import axios from 'axios';
import styles from './PointRecharge.module.css';
import host from "../../api";
import { useNavigate } from "react-router-dom";

const PointRecharge = () => {
    const navigate = useNavigate();
    const [accountNumber, setAccountNumber] = useState('');
    const [transactionType, setTransactionType] = useState(1); // 기본값 1 (충전)
    const [chargeType, setChargeType] = useState(0); // 기본값 0 (현금 충전)
    const [amount, setAmount] = useState(''); // 금액
    const [message, setMessage] = useState(''); // 메시지 표시

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('auth-token');

        if (!amount || isNaN(amount) || amount <= 0) {
            setMessage('올바른 금액을 입력해주세요.');
            return;
        }

        try {
            const response = await axios.post(
                `${host}point/`,
                {
                    addOrOut: 1,
                    transactionType: chargeType, // 0(현금충전), 1(챌린지보상), 2(기타)
                    amount: Number(amount), // 금액
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': token,
                    },
                }
            );
            setMessage('요청이 성공적으로 처리되었습니다.');
            console.log('응답:', response.data);
            setTimeout(() => {
                navigate('/mypage/mypoint');
            }, 1000); // 1초 후 이동

            // 입력 필드 초기화
            setTransactionType(1);
            setChargeType(0);
            setAmount('');
        } catch (error) {
            console.error('요청 중 오류 발생:', error);
            setMessage('요청 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
        }
    };

    const handleAmountChange = (e) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) {
            setAmount(value); // 숫자만 입력 가능하도록 처리
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.heading}>포인트 충전</h2>
            {message && <p className={styles.message}>{message}</p>}
            <form onSubmit={handleSubmit} className={styles.c}>
                {/* 금액 입력 */}
                <div className={styles.formGroup}>
                    <label className={styles.label}>
                        <div clasName={styles.a}> 입금계좌 선택: </div>
                        <select
                            value={accountNumber}
                            onChange={(e) => setAccountNumber(e.target.value)}
                            className={styles.select}
                        >
                            <option value="">계좌 선택</option>
                            <option value="카카오뱅크">국민은행</option>
                            <option value="토스">신한은행</option>
                            <option value="토스">하나은행</option>
                            <option value="토스">기업은행</option>
                            <option value="토스">우리은행</option>
                            <option value="토스">농협은행</option>
                            <option value="토스">신협</option>
                            <option value="토스">카카오뱅크</option>
                            <option value="토스">토스</option>
                            <option value="기타">기타</option>
                        </select>
                    </label>
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>
                        입금액:
                        <input
                            type="text"
                            value={amount}
                            onChange={handleAmountChange}
                            placeholder="입금액 입력"
                            required
                            className={styles.input}
                        />
                    </label>
                </div>
                <button type="submit" className={styles.button}>신청</button>
            </form>
        </div>
    );
};

export default PointRecharge;

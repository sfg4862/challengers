import React, { useState, useEffect } from 'react';
import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom';
import styles from './MyPage.module.css'; // styles로 가져오기
import axios from 'axios';
import host from "../../api";

function Mypage({ onLogout }) {
    const [showRecentlyViewed, setShowRecentlyViewed] = useState(false);
    const [myChallenges, setMyChallenges] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(true);

    const userId = JSON.parse(localStorage.getItem('user'));
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

    const handleDeleteProfile = async (e) => {
        e.preventDefault();
        console.log("Deleting user with ID:", userId);
        const token = localStorage.getItem('auth-token');

        if (!userId) {
            alert("유효한 사용자 정보가 없습니다.");
            return;
        }

        if (window.confirm('가입된 회원 정보가 모두 삭제됩니다. 탈퇴 후 같은 계정으로 재가입 시 기존에 가지고 있던 포인트는 복원되지 않습니다. 회원 탈퇴를 진행하시겠습니까?')) {
            try {
                const response = await axios.delete(`${host}auth/${userId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': token
                    }
                });

                if (response.status === 200) {
                    localStorage.removeItem('user');
                    localStorage.removeItem('auth-token');
                    onLogout(false); // handleLogout 호출 시 alert 표시 안 함
                    alert('그동안 이용해주셔서 감사합니다.');
                    navigate('/');
                } else {
                    console.error("회원탈퇴 실패:", response.status);
                    alert("회원탈퇴에 실패했습니다. 다시 시도해주세요.");
                }
            } catch (err) {
                console.error("회원탈퇴 중 오류 발생:", err);
                alert("회원탈퇴에 실패했습니다. 다시 시도해주세요.");
            }
        }
    };

    // 중첩 라우트 경로에 있을 때 MyPage 콘텐츠 숨기기
    const isSubRoute = location.pathname !== '/mypage';

    if (isSubRoute) {
        return <Outlet />;
    }

    return (
        <div className={styles.mypage}>
            <div className={styles.grayWrapper}>
                <div className={styles.grayLeft}>
                    <p>
                        오늘도 또 다른<br/> <span className={styles.textBrown}> 도전 </span> 어떠세요? <br />
                    </p>
                </div>
                <div className={styles.grayRight}>
                    <div className={styles.grayRightTop}>
                        <div className={styles.grayRightTopFirst}>
                            <span>나의 포인트 </span>
                            <Link className={styles.linkStyle} to="#">
                                0원
                            </Link>
                        </div>
                        <div className={styles.grayRightTopSecond}>
                            <span>포인트 충전 / 환전</span>
                            <div>
                                <button className={styles.pointbutton} onClick={() => navigate('/mypage/pointrecharge')}>충전하기</button>
                                <button onClick={() => navigate('/mypage/pointexchange')}>환전하기</button>
                            </div>
                        </div>
                    </div>
                    <div className={styles.grayRightThird}>
                        <p>성공한 도전 내역</p>
                        <Link className={styles.linkStyle} to="#">
                            0개
                        </Link>
                    </div>
                </div>
            </div>
            <div className={styles.whiteWrapper}>
                <div className={styles.whiteInner}>
                    <div className={styles.whiteLeft}>
                        <p className={styles.title}>마이페이지</p>
                        <div className={styles.boxList}>
                            <button onClick={() => navigate('/mypage/myinfo')}>내 정보</button>
                            <button onClick={() => navigate('/mypage/mypoint')}>포인트 관리</button>
                            <button onClick={() => navigate('/mypage/qandalist')}>자주 묻는 질문</button>
                            <button onClick={() => navigate('/mypage/qandalistprivate')}>1:1 문의</button>
                            <button onClick={handleDeleteProfile}>회원탈퇴</button>
                        </div>
                    </div>
                    <div className={styles.whiteRight}>
                        <div className={styles.orderStatus}>
                            <p>
                                <span>나의 현재 진행중 도전</span>
                            </p>
                        </div>
                        <div className={styles.inProgressChallenges}>
                            <ul className={styles.list}>
                                {myChallenges
                                    .filter(challenge => challenge.status === 1)
                                    .map(challenge => (
                                        <li key={challenge.id} className={styles.listItem}>
                                            <Link
                                                to={challenge.status === 0 || challenge.status === 2 ? "#" : `/mychallenge/${challenge.challengeId}`}
                                                className={`${styles.link} ${challenge.status === 0 || challenge.status === 2 ? styles.disabledLink : ""}`}
                                                onClick={(e) => {
                                                    if (challenge.status === 0 || challenge.status === 2) {
                                                        alert("진행중인 도전이 아닙니다.");
                                                        e.preventDefault(); // 링크 이동 차단
                                                    }
                                                }}
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Mypage;

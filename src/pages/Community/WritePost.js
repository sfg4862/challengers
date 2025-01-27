import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import host from "../../api";
import styles from "./WritePost.module.css";

const WritePost = ({ userName }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const type = 1;
    const rank = 0;
    const [image, setImage] = useState(null); // 사진 상태 추가
    const navigate = useNavigate();
    const token = localStorage.getItem('auth-token');

    const handleImageChange = (e) => {
        setImage(e.target.files[0]); // 파일 선택 시 상태 업데이트
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (title && content) {
            const formData = new FormData(); // FormData 생성
            formData.append('title', title);
            formData.append('content', content);
            formData.append('rank', rank);
            formData.append('type', type);
            if (image) {
                formData.append('image', image);
            }

            try {
                await axios.post(`${host}community/`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'auth-token': token,
                    },
                });
                navigate('/community');
            } catch (error) {
                console.error("Error posting data:", error);
            }
        } else {
            alert('제목과 내용을 모두 입력해주세요.');
        }
    };

    return (
        <div className={styles.writePostContainer}>
            <h2 className={styles.title}>글 작성</h2>
            <form onSubmit={handleSubmit} className={styles.r}>
                <div>
                    <label className={styles.formLabel}>제목</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className={styles.formInput}
                        required
                    />
                </div>
                <div>
                    <label className={styles.formLabel}>내용</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className={styles.formInput}
                        required
                    />
                </div>
                <div>
                    <label className={styles.formLabel}>사진 첨부</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className={styles.formInput}
                    />
                </div>

                <button
                    type="submit"
                    disabled={!title || !content}
                    className={styles.submitButton}
                >
                    작성 완료
                </button>
            </form>
        </div>
    );
};

export default WritePost;

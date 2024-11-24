import React, { Fragment, useState } from 'react';
import UserInput from './Signup/UserInput';
import { useNavigate } from 'react-router-dom';
import { SIGNUP_LIST, AGREE_LIST } from './Signup/SignupData';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import axios from 'axios';
import styles from './SignupPage.module.css';
import host from '../api';

const SignupPage = () => {
    const navigate = useNavigate();
    const [signupInfo, setSignupInfo] = useState({
        email: '',
        password: '',
        passwordCheck: '',
        nickName: '',
        phoneNumber: '',
        image: '',
    });

    const [previewImage, setPreviewImage] = useState(null);
    const [isClick, setIsClick] = useState([]);

    const handleInfo = (e) => {
        const { name, value } = e.target;
        setSignupInfo((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);

            setSignupInfo((prevState) => ({
                ...prevState,
                image: file,
            }));
        }
    };

    const isPasswordCorrect = signupInfo.password === signupInfo.passwordCheck;

    const signupClick = async (e) => {
        e.preventDefault();
        if (!isPasswordCorrect) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }

        try {
            const formData = new FormData();

            formData.append('email', signupInfo.email);
            formData.append('password', signupInfo.password);
            formData.append('phoneNumber', signupInfo.phoneNumber);
            formData.append('nickName', signupInfo.nickName);
            if (signupInfo.image) {
                formData.append('image', signupInfo.image);
            }

            const response = await axios.post(`${host}auth/signup`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                alert('회원가입 되었습니다!');
                navigate('/login');
            } else {
                alert('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.');
            }
        } catch (error) {
            alert('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.');
        }
    };

    const makeButtonCheck = (id) => {
        if (isClick.includes(id)) {
            setIsClick(isClick.filter((i) => i !== id));
            return;
        }
        setIsClick([...isClick, id]);
    };

    const isAllChecked = AGREE_LIST.length === isClick.length;

    return (
        <form className={styles.signup}>
            <div className={styles.container}>
                <div className={styles.title}>
                    <h2 className={styles.mainTitle}>회원가입</h2>
                    <div className={styles.subTitle}>
                        <h3 className={styles.fontBold}>기본정보</h3>
                        <p className={styles.fontRight}>
                            <span className={styles.fontRed}>*</span> 필수입력사항
                        </p>
                    </div>
                </div>
                <div className={styles.profileImageContainer}>
                    <label htmlFor="image-upload">
                        {previewImage ? (
                            <img src={previewImage} alt="Profile" className={styles.profileImage}/>
                        ) : (
                            <div className={styles.profilePlaceholder}></div>
                        )}
                    </label>
                    <input
                        type="file"
                        id="image-upload"
                        accept="image/*"
                        onChange={handleFileChange}
                        style={{display: 'none'}}
                    />
                </div>
                <div className={styles.inputTable}>
                    {SIGNUP_LIST.map(({id, title, placeholder, info, name, type}) => (
                        <UserInput
                            key={id}
                            title={title}
                            placeholder={placeholder}
                            info={info}
                            name={name}
                            handleInfo={handleInfo}
                            check={isPasswordCorrect}
                            type={type}
                        />
                    ))}

                </div>

                <button className={styles.inputButton} onClick={signupClick}>
                    가입하기
                </button>
            </div>
        </form>
    );
};

export default SignupPage;

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/services/supabase';
import classes from './Admin.module.css';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
      setLoading(false);
    } else {
      navigate('/admin/dashboard');
    }
  };

  return (
    <div className={classes.adminContainer}>
      <div className={classes.loginBox}>
        <h1 className={classes.title}>Admin Login</h1>
        <p className={classes.subtitle}>청첩장 관리자 페이지</p>
        
        <form onSubmit={handleLogin} className={classes.form}>
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={classes.input}
            required
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={classes.input}
            required
          />
          {error && <p className={classes.error}>{error}</p>}
          <button type="submit" disabled={loading} className={classes.submitBtn}>
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>
      </div>
    </div>
  );
}

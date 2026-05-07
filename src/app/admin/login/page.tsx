'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Wrench, Loader, Eye, EyeOff } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import styles from './page.module.css';

const schema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha obrigatória'),
});

type FormData = z.infer<typeof schema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: FormData) {
    setAuthError('');
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      router.push('/admin/equipamentos');
    } catch {
      setAuthError('E-mail ou senha incorretos.');
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <Wrench size={22} />
          <span>MAQUIN<span className={styles.accent}>ÁRIOS</span></span>
        </div>
        <h1 className={styles.title}>Área Administrativa</h1>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form} noValidate>
          <div className={styles.field}>
            <label className="label" htmlFor="admin-email">E-mail</label>
            <input
              id="admin-email"
              className="input"
              type="email"
              placeholder="admin@maquinarios.com.br"
              {...register('email')}
            />
            {errors.email && <span className={styles.error}>{errors.email.message}</span>}
          </div>

          <div className={styles.field}>
            <label className="label" htmlFor="admin-password">Senha</label>
            <div className={styles.passwordWrap}>
              <input
                id="admin-password"
                className="input"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                {...register('password')}
              />
              <button
                type="button"
                className={styles.eyeBtn}
                onClick={() => setShowPassword(v => !v)}
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <span className={styles.error}>{errors.password.message}</span>}
          </div>

          {authError && <p className={styles.authError}>{authError}</p>}

          <button
            type="submit"
            className={`btn btn-primary btn-lg ${styles.submitBtn}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? <><Loader size={16} className={styles.spin} /> Entrando...</> : 'Entrar'}
          </button>
        </form>

        <p className={styles.hint}>
          Use o e-mail e senha cadastrados no Firebase Authentication.
        </p>
      </div>
    </div>
  );
}

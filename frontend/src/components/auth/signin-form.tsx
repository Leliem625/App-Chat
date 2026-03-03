/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link, useNavigate } from 'react-router';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { message } from 'antd';
import { useStoreUser } from '../../store/useStoreUser';
// import { AxiosError } from 'axios';

const signInSchema = z.object({
    email: z.email('Email không hợp lệ'),
    password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
});
type SignInFormSchema = z.infer<typeof signInSchema>;
export default function SignInForm() {
    const navigate = useNavigate();
    const { signIn } = useStoreUser();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignInFormSchema>({ resolver: zodResolver(signInSchema) });

    const onSubmit = async (data: SignInFormSchema) => {
        try {
            const { email, password } = data;
            await signIn(email, password);
            navigate('/');
        } catch (error: any) {
            message.error(error.response?.data?.message || 'Đăng nhập thất bại');
        }
    };
    return (
        <div className="grid gap-6 bg-white p-6 md:p-8 rounded-lg shadow-sm">
            <div className="flex flex-col gap-2 text-center">
                <h1 className="text-2xl font-bold tracking-tight"> Đăng nhập vào tài khoản Moji của bạn</h1>
            </div>

            <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
                <div className="grid gap-2">
                    <label htmlFor="email" className="text-sm font-medium">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        required
                        {...register('email')}
                        className="flex h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    />
                    {errors.email && <p className="text-destructive text-sm">{errors.email.message}</p>}
                </div>
                <div className="grid gap-2">
                    <label htmlFor="password" className="text-sm font-medium">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        required
                        {...register('password')}
                        className="flex h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    />
                    {errors.password && <p className="text-destructive text-sm">{errors.password.message}</p>}
                </div>

                <button
                    type="submit"
                    className="bg-black text-white rounded-md h-10 hover:bg-gray-800"
                    disabled={isSubmitting}
                >
                    Sign In
                </button>
            </form>

            <div className="text-center text-sm text-gray-500">
                Already have an account?{' '}
                <Link to="/signup" className="underline hover:text-black">
                    Sign up
                </Link>
            </div>
        </div>
    );
}

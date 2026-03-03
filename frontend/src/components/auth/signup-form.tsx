/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link, useNavigate } from 'react-router';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useStoreUser } from '../../store/useStoreUser';

import { message } from 'antd';
const signUpSchema = z.object({
    firstname: z.string().min(1, 'Tên bắt buộc phải có'),
    lastname: z.string().min(1, 'Họ bắt buộc phải có'),
    username: z.string().min(3, 'Tên đăng nhập phải có ít nhất 3 ký tự'),
    email: z.email('Email không hợp lệ'),
    password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
});

type SignUpFormValues = z.infer<typeof signUpSchema>;
export function SignUpForm() {
    const navigate = useNavigate();
    const { signUp } = useStoreUser();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignUpFormValues>({
        resolver: zodResolver(signUpSchema),
    });
    const onSubmit = async (data: SignUpFormValues) => {
        try {
            const { firstname, lastname, username, email, password } = data;

            await signUp(username, password, email, firstname, lastname);

            navigate('/signin');
        } catch (error: any) {
            message.error(error.response?.data?.message || 'Đăng kí thất bại');
        }
    };

    return (
        <div className="grid gap-6 bg-white p-6 md:p-8 rounded-lg shadow-sm">
            <div className="flex flex-col gap-2 text-center">
                <h1 className="text-2xl font-bold tracking-tight">Create an account</h1>
                <p className="text-sm text-gray-500">Enter your email below to create your account</p>
            </div>

            <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
                <div className="flex items-center justify-between gap-4">
                    <div className="w-[50%]">
                        <label htmlFor="lastname" className="text-sm font-medium">
                            Họ
                        </label>
                        <input
                            id="lastname"
                            type="text"
                            required
                            {...register('lastname')}
                            className="flex h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                        />
                        {errors.lastname && <p className="text-destructive text-sm">{errors.lastname.message}</p>}
                    </div>

                    <div className="w-[50%]">
                        <label htmlFor="firstname" className="text-sm font-medium">
                            Tên
                        </label>
                        <input
                            id="firstname"
                            type="text"
                            required
                            {...register('firstname')}
                            className="flex h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                        />
                        {errors.firstname && <p className="text-destructive text-sm">{errors.firstname.message}</p>}
                    </div>
                </div>

                <div className="grid gap-2">
                    <label htmlFor="username" className="text-sm font-medium">
                        Username
                    </label>
                    <input
                        id="username"
                        type="text"
                        required
                        {...register('username')}
                        className="flex h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                    />
                    {errors.username && <p className="text-destructive text-sm">{errors.username.message}</p>}
                </div>
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
                    Sign Up
                </button>
            </form>

            <div className="text-center text-sm text-gray-500">
                Already have an account?{' '}
                <Link to="/signin" className="underline hover:text-black">
                    Sign in
                </Link>
            </div>
        </div>
    );
}

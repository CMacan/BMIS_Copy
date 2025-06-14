import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import PasswordInput from '@/Components/PasswordInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="px-2 pb-2 sm:px-3 sm:pb-4">
                <div className='pt-4'>
                    {/* <InputLabel htmlFor="email" value="Email"/> */}

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                        useLabel={true}
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4 py-2">
                    {/* <InputLabel htmlFor="password" value="Password" className="text-gray-700"/> */}

                    <PasswordInput
                        id="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                        useLabel={true}
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="flex items-center justify-between w-full pt-2 mr-8">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                        />
                        <span className="ms-2 text-xs sm:text-sm text-gray-700">
                            Remember me
                        </span>
                    </label>
                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="rounded-md text-xs sm:text-sm text-gray-900 underline hover:text-gray-700 
                            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ml-8"
                        >
                            Forgot your password?
                        </Link>
                    )}
                </div>

                <div className="mt-4 flex flex-col items-center justify-center">
                    <div className="w-full py-1">
                        <PrimaryButton className="w-full" disabled={processing}>
                            Sign in
                        </PrimaryButton>
                    </div>
                    <div className="w-full">
                        <Link 
                            href={route('register')}
                            className='w-full inline-flex items-center justify-center rounded-s border border-gray-300 bg-sky-950 px-4 py-3 
                            text-xs font-semibold uppercase tracking-widest text-white shadow-sm transition duration-150 ease-in-out 
                            hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-900 focus:ring-offset-2 disabled:opacity-25 '>
                                Sign up
                        </Link>
                    </div>
                </div>
            </form>
        </GuestLayout>
    );
}

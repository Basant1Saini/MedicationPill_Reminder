import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate, Link } from 'react-router-dom'
import useAuthStore from '../store/authStore'

const schema = z.object({
  name: z.string().min(2, 'Min 2 characters'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Min 6 characters'),
})

export default function Register() {
  const { register: registerUser } = useAuthStore()
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm({
    resolver: zodResolver(schema),
  })

  const onSubmit = async ({ name, email, password }) => {
    try {
      await registerUser(name, email, password)
      navigate('/')
    } catch (err) {
      setError('root', { message: err.response?.data?.message || 'Registration failed' })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-2xl shadow p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-6">Create Account</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium">Name</label>
            <input {...register('name')} className="w-full border rounded px-3 py-2 mt-1" placeholder="Your name" />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="text-sm font-medium">Email</label>
            <input {...register('email')} className="w-full border rounded px-3 py-2 mt-1" placeholder="you@example.com" />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="text-sm font-medium">Password</label>
            <input type="password" {...register('password')} className="w-full border rounded px-3 py-2 mt-1" />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>
          {errors.root && <p className="text-red-500 text-sm text-center">{errors.root.message}</p>}
          <button disabled={isSubmitting} className="bg-blue-600 text-white rounded py-2 hover:bg-blue-700 disabled:opacity-50">
            {isSubmitting ? 'Creating...' : 'Register'}
          </button>
        </form>
        <p className="text-center text-sm mt-4 text-gray-500">
          Have an account? <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  )
}

import { fail } from '@sveltejs/kit'
import type { Actions } from './$types'

export const actions = {
  default: async ({ request, locals, getClientAddress }) => {
    const data = await request.formData()
    const email = data.get('email')?.toString()
    const ipAddress = getClientAddress()

    if (!email) {
      return fail(400, { message: 'Email is required' })
    }

    try {
      const { error } = await locals.supabase
        .from('waitlist_signups')
        .insert([
          {
            email,
            ip_address: ipAddress,
            status: 'pending'
          }
        ])
        .select()

      if (error) {
        if (error.code === '23505') { // Unique violation error code
          return fail(400, { 
            message: 'This email is already on the waitlist'
          })
        }
        throw error
      }

      return {
        success: true,
        message: 'Thanks for joining our waitlist!'
      }
    } catch (error) {
      console.error('Waitlist signup error:', error)
      return fail(500, {
        success: false,
        message: 'Something went wrong. Please try again.'
      })
    }
  }
} satisfies Actions
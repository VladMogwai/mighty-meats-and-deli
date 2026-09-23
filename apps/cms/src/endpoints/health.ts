import type { Endpoint } from 'payload'

/**
 * GET /api/health — touches the database.
 * Pinged on a schedule so the free Supabase project is never paused for inactivity.
 */
export const healthEndpoint: Endpoint = {
  path: '/health',
  method: 'get',
  handler: async (req) => {
    const { totalDocs } = await req.payload.count({ collection: 'pages' })
    return Response.json({ status: 'ok', pages: totalDocs })
  },
}

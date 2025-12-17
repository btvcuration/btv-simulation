import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zzzgixizyafwatdmvuxc.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6emdpeGl6eWFmd2F0ZG12dXhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU4MjgyNzEsImV4cCI6MjA4MTQwNDI3MX0.iLsQ2sqnd9nNZ3bL9fzM0Px6YJ4Of-YNzh1o1rIBdxg'

export const supabase = createClient(supabaseUrl, supabaseKey)

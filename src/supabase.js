import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://twdhmzosgdfctccgmxcw.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3ZGhtem9zZ2RmY3RjY2dteGN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1MDQzNzQsImV4cCI6MjA5MzA4MDM3NH0.vsr8oEsqXtUvCaOdWi5NA-VdH3mGlwvfGhwmgmPci2c'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
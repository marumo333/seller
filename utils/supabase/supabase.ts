// supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

// SupabaseのURLとAPIキーを環境変数から取得
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// **1回だけ作成するシングルトンインスタンス**
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY,);
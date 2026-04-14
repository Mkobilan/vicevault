import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const fileExt = file.name.split('.').pop()
    const filePath = `posts/${user.id}/${Date.now()}.${fileExt}`

    // Upload to 'feed' bucket (ensure this exists in Supabase)
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('feed')
      .upload(filePath, file, {
        upsert: true,
        contentType: file.type
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 })
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('feed')
      .getPublicUrl(filePath)

    return NextResponse.json({ url: publicUrl })

  } catch (err: any) {
    console.error('Feed image upload error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

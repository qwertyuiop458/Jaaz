import { compressImageFile } from '@/utils/imageUtils'
import { apiFetch } from './client'

export async function uploadImage(
  file: File
): Promise<{ file_id: string; width: number; height: number; url: string }> {
  // Compress image before upload
  const compressedFile = await compressImageFile(file)

  const formData = new FormData()
  formData.append('file', compressedFile)
  const response = await apiFetch('/api/upload_image', {
    method: 'POST',
    body: formData,
  })
  return await response.json()
}

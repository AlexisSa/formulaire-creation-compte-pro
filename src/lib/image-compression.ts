/**
 * Utilitaires pour la compression d'images côté client
 * Optimise automatiquement les images uploadées pour mobile
 */

export interface CompressionOptions {
  maxWidth?: number
  maxHeight?: number
  quality?: number
  maxSizeKB?: number
}

const DEFAULT_OPTIONS: Required<CompressionOptions> = {
  maxWidth: 2048,
  maxHeight: 2048,
  quality: 0.8,
  maxSizeKB: 500,
}

/**
 * Compresse une image en réduisant sa taille et sa qualité
 * Retourne un Blob optimisé pour mobile
 */
export async function compressImage(
  file: File,
  options: CompressionOptions = {}
): Promise<File> {
  const opts = { ...DEFAULT_OPTIONS, ...options }

  return new Promise((resolve, reject) => {
    // Vérifier que c'est une image
    if (!file.type.startsWith('image/')) {
      resolve(file)
      return
    }

    const reader = new FileReader()

    reader.onload = (e) => {
      const img = new Image()

      img.onload = async () => {
        try {
          // Calculer les nouvelles dimensions
          let width = img.width
          let height = img.height

          if (width > opts.maxWidth || height > opts.maxHeight) {
            const ratio = Math.min(opts.maxWidth / width, opts.maxHeight / height)
            width = width * ratio
            height = height * ratio
          }

          // Créer un canvas pour redimensionner
          const canvas = document.createElement('canvas')
          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')

          if (!ctx) {
            reject(new Error('Impossible de créer le contexte canvas'))
            return
          }

          // Dessiner l'image redimensionnée
          ctx.drawImage(img, 0, 0, width, height)

          // Convertir en blob avec compression
          const blob = await new Promise<Blob>((resolveBlob, rejectBlob) => {
            canvas.toBlob(
              (blob) => {
                if (blob) {
                  resolveBlob(blob)
                } else {
                  rejectBlob(new Error('Échec de la compression'))
                }
              },
              file.type,
              opts.quality
            )
          })

          // Vérifier la taille finale
          const sizeKB = blob.size / 1024
          if (sizeKB > opts.maxSizeKB) {
            console.warn(
              `Image compressée : ${sizeKB.toFixed(2)}KB (cible: ${opts.maxSizeKB}KB)`
            )
          }

          // Créer un nouveau File avec le blob compressé
          const compressedFile = new File([blob], file.name, {
            type: file.type,
            lastModified: Date.now(),
          })

          resolve(compressedFile)
        } catch (error) {
          console.error('Erreur de compression:', error)
          // En cas d'erreur, retourner le fichier original
          resolve(file)
        }
      }

      img.onerror = () => {
        console.error("Impossible de charger l'image")
        resolve(file)
      }

      img.src = e.target?.result as string
    }

    reader.onerror = () => {
      reject(new Error('Impossible de lire le fichier'))
    }

    reader.readAsDataURL(file)
  })
}

/**
 * Formate la taille de fichier en chaîne lisible
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

/**
 * Vérifie si un fichier est une image
 */
export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/')
}

/**
 * Récupère la taille de fichier optimisée pour mobile
 * Retourne les dimensions idéales selon l'orientation
 */
export function getMobileImageDimensions(orientation: 'portrait' | 'landscape'): {
  width: number
  height: number
} {
  if (orientation === 'portrait') {
    return { width: 1242, height: 2208 } // iPhone Portrait
  }
  return { width: 2208, height: 1242 } // iPhone Landscape
}

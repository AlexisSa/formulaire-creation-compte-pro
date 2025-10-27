import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FileUpload } from '@/components/file-upload'

describe('FileUpload', () => {
  it('affiche le label', () => {
    render(<FileUpload label="Mon document" />)
    expect(screen.getByText('Mon document')).toBeInTheDocument()
  })

  it('affiche la zone de dépôt quand aucun fichier n\'est sélectionné', () => {
    render(<FileUpload />)
    expect(screen.getByText(/Cliquez pour parcourir/)).toBeInTheDocument()
  })

  it('affiche le fichier sélectionné', () => {
    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' })
    render(<FileUpload value={file} />)
    expect(screen.getByText('test.pdf')).toBeInTheDocument()
  })

  it('appelle onFileChange lors de la suppression', async () => {
    const handleChange = jest.fn()
    const user = userEvent.setup()
    const file = new File(['test'], 'test.pdf', { type: 'application/pdf' })
    
    render(<FileUpload value={file} onFileChange={handleChange} />)
    
    const removeButton = screen.getByLabelText('Supprimer le fichier')
    await user.click(removeButton)
    
    expect(handleChange).toHaveBeenCalledWith(null)
  })

  it('affiche l\'erreur', () => {
    render(<FileUpload error="Fichier requis" />)
    expect(screen.getByText('Fichier requis')).toBeInTheDocument()
  })

  it('formate correctement la taille des fichiers', () => {
    const file = new File(['x'.repeat(1500)], 'test.pdf', { type: 'application/pdf' })
    render(<FileUpload value={file} />)
    expect(screen.getByText(/KB/)).toBeInTheDocument()
  })
})


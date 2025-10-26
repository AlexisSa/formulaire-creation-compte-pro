import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from '@/components/ui/input'

describe('Input', () => {
  it('affiche l\'input avec un placeholder', () => {
    render(<Input placeholder="Entrez votre nom" />)
    expect(screen.getByPlaceholderText('Entrez votre nom')).toBeInTheDocument()
  })

  it('gère la saisie de texte', async () => {
    const user = userEvent.setup()
    render(<Input aria-label="Test input" />)
    
    const input = screen.getByLabelText('Test input')
    await user.type(input, 'Hello')
    
    expect(input).toHaveValue('Hello')
  })

  it('peut être désactivé', () => {
    render(<Input disabled aria-label="Input désactivé" />)
    expect(screen.getByLabelText('Input désactivé')).toBeDisabled()
  })

  it('accepte différents types', () => {
    render(<Input type="email" aria-label="Email" />)
    expect(screen.getByLabelText('Email')).toHaveAttribute('type', 'email')
  })

  it('applique les classes personnalisées', () => {
    render(<Input className="custom-class" aria-label="Custom" />)
    expect(screen.getByLabelText('Custom')).toHaveClass('custom-class')
  })
})


import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '@/components/ui/button'

describe('Button', () => {
  it('affiche le texte du bouton', () => {
    render(<Button>Cliquez ici</Button>)
    expect(screen.getByRole('button', { name: 'Cliquez ici' })).toBeInTheDocument()
  })

  it('gère les clics', async () => {
    const handleClick = jest.fn()
    const user = userEvent.setup()

    render(<Button onClick={handleClick}>Cliquer</Button>)
    await user.click(screen.getByRole('button'))

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('peut être désactivé', () => {
    render(<Button disabled>Désactivé</Button>)
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })

  it('applique la variante par défaut', () => {
    render(<Button>Défaut</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-blue-600')
  })

  it('applique la variante outline', () => {
    render(<Button variant="outline">Outline</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('border')
  })

  it('applique la taille lg', () => {
    render(<Button size="lg">Large</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('h-11')
  })
})

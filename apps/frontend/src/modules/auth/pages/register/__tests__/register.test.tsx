import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Register from '../register';
import * as useAuthModule from '../../../hooks/useAuth';

// Mock dependencies
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'register.title': 'Create your account',
        'register.subtitle': 'Join Sailio',
        'register.step1.title': 'Personal Info',
        'register.step1.firstName': 'First Name',
        'register.step1.firstNamePlaceholder': 'John',
        'register.step1.lastName': 'Last Name',
        'register.step1.lastNamePlaceholder': 'Doe',
        'register.step1.email': 'Email',
        'register.step1.emailPlaceholder': 'coach@example.com',
        'register.step1.password': 'Password',
        'register.step1.passwordPlaceholder': 'Choose password',
        'register.step1.confirmPassword': 'Confirm Password',
        'register.step1.confirmPasswordPlaceholder': 'Re-enter password',
        'register.step2.title': 'Sailing Credentials',
        'register.step2.certificationLevel': 'Certification Level',
        'register.step2.certificationPlaceholder': 'Select certification level',
        'register.step2.clubAffiliation': 'Club Affiliation',
        'register.step2.clubPlaceholder': 'Sailing Club Name',
        'register.step2.phoneNumber': 'Phone Number',
        'register.step2.phonePlaceholder': '+1 (555) 123-4567',
        'register.step3.title': 'Review',
        'register.step3.personalInfo': 'Personal Information',
        'register.step3.sailingCredentials': 'Sailing Credentials',
        'register.step3.name': 'Name',
        'register.step3.email': 'Email',
        'register.step3.certification': 'Certification',
        'register.step3.club': 'Club',
        'register.step3.phone': 'Phone',
        'register.step3.termsMessage': 'By creating an account, you agree to our Terms',
        'register.step3.notProvided': 'Not provided',
        'register.buttons.next': 'Next',
        'register.buttons.back': 'Back',
        'register.buttons.createAccount': 'Create Account',
        'register.buttons.backToLogin': 'Back to Login',
        'register.buttons.creating': 'Creating account...',
        'register.certificationLevels.beginner': 'Beginner',
        'register.certificationLevels.intermediate': 'Intermediate',
        'register.certificationLevels.advanced': 'Advanced',
        'errors.firstNameRequired': 'First name is required',
        'errors.lastNameRequired': 'Last name is required',
        'errors.emailRequired': 'Email is required',
        'errors.passwordRequired': 'Password is required',
        'errors.registrationFailed': 'Registration failed',
      };
      return translations[key] || key;
    },
  }),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../../../components', () => ({
  LanguageSelector: () => <div data-testid="language-selector">Language Selector</div>,
}));

const mockMutateAsync = vi.fn();
const mockUseRegisterMutation = {
  mutateAsync: mockMutateAsync,
  isPending: false,
  isError: false,
  isSuccess: false,
  error: null,
  data: undefined,
  mutate: vi.fn(),
  reset: vi.fn(),
};

vi.spyOn(useAuthModule, 'useRegister').mockReturnValue(mockUseRegisterMutation as any);

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Register', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Initial render', () => {
    it('should render step 1 initially', async () => {
      renderWithRouter(<Register />);

      await waitFor(() => {
        expect(screen.getByText('Create your account')).toBeInTheDocument();
      });

      expect(screen.getByText('Join Sailio')).toBeInTheDocument();
      expect(screen.getByText('Personal Info')).toBeInTheDocument();
      expect(screen.getByLabelText('First Name')).toBeInTheDocument();
      expect(screen.getByLabelText('Last Name')).toBeInTheDocument();
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
      expect(screen.getByLabelText('Password')).toBeInTheDocument();
      expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
    });

    it('should render language selector', async () => {
      renderWithRouter(<Register />);

      await waitFor(() => {
        expect(screen.getByTestId('language-selector')).toBeInTheDocument();
      });
    });

    it('should render back to login button', async () => {
      renderWithRouter(<Register />);

      await waitFor(() => {
        expect(screen.getByText('← Back to Login')).toBeInTheDocument();
      });
    });

    it('should render step indicator', async () => {
      renderWithRouter(<Register />);

      await waitFor(() => {
        expect(screen.getByText('1')).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument();
        expect(screen.getByText('3')).toBeInTheDocument();
      });
    });
  });

  describe('Step 1 - Personal Info', () => {
    it('should show validation errors when next is clicked without filling fields', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Register />);

      const nextButton = await screen.findByRole('button', { name: 'Next' });
      await user.click(nextButton);

      await waitFor(() => {
        expect(screen.getByText('First name is required')).toBeInTheDocument();
        expect(screen.getByText('Last name is required')).toBeInTheDocument();
        expect(screen.getByText('Email is required')).toBeInTheDocument();
        expect(screen.getAllByText('Password is required')).toHaveLength(2);
      });
    });

    it('should allow entering personal information', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Register />);

      const firstNameInput = await screen.findByLabelText('First Name');
      const lastNameInput = await screen.findByLabelText('Last Name');
      const emailInput = await screen.findByLabelText('Email');
      const passwordInput = await screen.findByLabelText('Password');
      const confirmPasswordInput = await screen.findByLabelText('Confirm Password');

      await user.type(firstNameInput, 'John');
      await user.type(lastNameInput, 'Doe');
      await user.type(emailInput, 'john@example.com');
      await user.type(passwordInput, 'Password123');
      await user.type(confirmPasswordInput, 'Password123');

      expect(firstNameInput).toHaveValue('John');
      expect(lastNameInput).toHaveValue('Doe');
      expect(emailInput).toHaveValue('john@example.com');
      expect(passwordInput).toHaveValue('Password123');
      expect(confirmPasswordInput).toHaveValue('Password123');
    });

    it('should move to step 2 when validation passes', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Register />);

      await user.type(await screen.findByLabelText('First Name'), 'John');
      await user.type(await screen.findByLabelText('Last Name'), 'Doe');
      await user.type(await screen.findByLabelText('Email'), 'john@example.com');
      await user.type(await screen.findByLabelText('Password'), 'Password123');
      await user.type(await screen.findByLabelText('Confirm Password'), 'Password123');

      const nextButton = await screen.findByRole('button', { name: 'Next' });
      await user.click(nextButton);

      await waitFor(() => {
        expect(screen.getByText('Sailing Credentials')).toBeInTheDocument();
      });

      expect(await screen.findByLabelText('Certification Level')).toBeInTheDocument();
      expect(screen.getByLabelText('Club Affiliation')).toBeInTheDocument();
      expect(screen.getByLabelText('Phone Number')).toBeInTheDocument();
    });
  });

  describe('Step 2 - Sailing Credentials', () => {
    it('should allow entering sailing credentials', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Register />);

      // Fill step 1
      await user.type(await screen.findByLabelText('First Name'), 'John');
      await user.type(await screen.findByLabelText('Last Name'), 'Doe');
      await user.type(await screen.findByLabelText('Email'), 'john@example.com');
      await user.type(await screen.findByLabelText('Password'), 'Password123');
      await user.type(await screen.findByLabelText('Confirm Password'), 'Password123');
      await user.click(await screen.findByRole('button', { name: 'Next' }));

      // Wait for step 2
      await waitFor(() => {
        expect(screen.getByLabelText('Club Affiliation')).toBeInTheDocument();
      });

      await user.type(screen.getByLabelText('Club Affiliation'), 'Yacht Club');
      await user.type(screen.getByLabelText('Phone Number'), '+1234567890');

      expect(screen.getByLabelText('Club Affiliation')).toHaveValue('Yacht Club');
      expect(screen.getByLabelText('Phone Number')).toHaveValue('+1234567890');
    });

    it('should have back and next buttons', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Register />);

      // Fill step 1
      await user.type(await screen.findByLabelText('First Name'), 'John');
      await user.type(await screen.findByLabelText('Last Name'), 'Doe');
      await user.type(await screen.findByLabelText('Email'), 'john@example.com');
      await user.type(await screen.findByLabelText('Password'), 'Password123');
      await user.type(await screen.findByLabelText('Confirm Password'), 'Password123');
      await user.click(await screen.findByRole('button', { name: 'Next' }));

      await waitFor(() => {
        expect(screen.getAllByRole('button', { name: 'Back' })).toHaveLength(1);
        // Should have Next button on step 2
        expect(screen.getAllByRole('button', { name: 'Next' })).toHaveLength(1);
      });
    });

    it('should go back to step 1 when back button is clicked', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Register />);

      // Fill and go to step 2
      await user.type(await screen.findByLabelText('First Name'), 'John');
      await user.type(await screen.findByLabelText('Last Name'), 'Doe');
      await user.type(await screen.findByLabelText('Email'), 'john@example.com');
      await user.type(await screen.findByLabelText('Password'), 'Password123');
      await user.type(await screen.findByLabelText('Confirm Password'), 'Password123');
      await user.click(await screen.findByRole('button', { name: 'Next' }));

      await waitFor(() => {
        expect(screen.getByText('Sailing Credentials')).toBeInTheDocument();
      });

      // Go back
      await user.click(screen.getByRole('button', { name: 'Back' }));

      await waitFor(() => {
        expect(screen.getByText('Personal Info')).toBeInTheDocument();
      });

      expect(screen.getByLabelText('First Name')).toHaveValue('John');
      expect(screen.getByLabelText('Last Name')).toHaveValue('Doe');
    });

    it('should move to step 3 when next is clicked', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Register />);

      //Fill step 1
      await user.type(await screen.findByLabelText('First Name'), 'John');
      await user.type(await screen.findByLabelText('Last Name'), 'Doe');
      await user.type(await screen.findByLabelText('Email'), 'john@example.com');
      await user.type(await screen.findByLabelText('Password'), 'Password123');
      await user.type(await screen.findByLabelText('Confirm Password'), 'Password123');
      await user.click(await screen.findByRole('button', { name: 'Next' }));

      await waitFor(() => {
        expect(screen.getByText('Sailing Credentials')).toBeInTheDocument();
      });

      // Move to step 3
      await user.click(screen.getAllByRole('button', { name: 'Next' })[0]);

      await waitFor(() => {
        expect(screen.getByText('Review')).toBeInTheDocument();
        expect(screen.getByText('Personal Information')).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Sailing Credentials' })).toBeInTheDocument();
      });
    });
  });

  describe('Step 3 - Review', () => {
    it('should display review information', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Register />);

      // Fill step 1
      await user.type(await screen.findByLabelText('First Name'), 'John');
      await user.type(await screen.findByLabelText('Last Name'), 'Doe');
      await user.type(await screen.findByLabelText('Email'), 'john@example.com');
      await user.type(await screen.findByLabelText('Password'), 'Password123');
      await user.type(await screen.findByLabelText('Confirm Password'), 'Password123');
      await user.click(await screen.findByRole('button', { name: 'Next' }));

      // Wait and fill step 2
      await waitFor(() => {
        expect(screen.getByLabelText('Club Affiliation')).toBeInTheDocument();
      });

      await user.type(screen.getByLabelText('Club Affiliation'), 'Yacht Club');
      await user.type(screen.getByLabelText('Phone Number'), '+1234567890');
      await user.click(screen.getAllByRole('button', { name: 'Next' })[0]);

      // Check step 3
      await waitFor(() => {
        expect(screen.getByText('Review')).toBeInTheDocument();
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('john@example.com')).toBeInTheDocument();
        expect(screen.getByText('Yacht Club')).toBeInTheDocument();
        expect(screen.getByText('+1234567890')).toBeInTheDocument();
      });
    });

    it('should show terms message', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Register />);

      // Fill step 1
      await user.type(await screen.findByLabelText('First Name'), 'John');
      await user.type(await screen.findByLabelText('Last Name'), 'Doe');
      await user.type(await screen.findByLabelText('Email'), 'john@example.com');
      await user.type(await screen.findByLabelText('Password'), 'Password123');
      await user.type(await screen.findByLabelText('Confirm Password'), 'Password123');
      await user.click(await screen.findByRole('button', { name: 'Next' }));

      // Wait for step 2 and go to step 3
      await waitFor(() => {
        expect(screen.getByLabelText('Club Affiliation')).toBeInTheDocument();
      });
      await user.click(screen.getAllByRole('button', { name: 'Next' })[0]);

      await waitFor(() => {
        expect(
          screen.getByText('By creating an account, you agree to our Terms')
        ).toBeInTheDocument();
      });
    });

    it('should have back and create account buttons', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Register />);

      // Fill step 1
      await user.type(await screen.findByLabelText('First Name'), 'John');
      await user.type(await screen.findByLabelText('Last Name'), 'Doe');
      await user.type(await screen.findByLabelText('Email'), 'john@example.com');
      await user.type(await screen.findByLabelText('Password'), 'Password123');
      await user.type(await screen.findByLabelText('Confirm Password'), 'Password123');
      await user.click(await screen.findByRole('button', { name: 'Next' }));

      // Wait for step 2 and go to step 3
      await waitFor(() => {
        expect(screen.getByLabelText('Club Affiliation')).toBeInTheDocument();
      });
      await user.click(screen.getAllByRole('button', { name: 'Next' })[0]);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Back' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Create Account' })).toBeInTheDocument();
      });
    });

    it('should submit form when create account is clicked', async () => {
      mockMutateAsync.mockResolvedValueOnce({
        user: { id: '1', email: 'john@example.com', firstName: 'John', lastName: 'Doe' },
        tokens: { accessToken: 'token', refreshToken: 'refresh' },
      });

      const user = userEvent.setup();
      renderWithRouter(<Register />);

      // Fill step 1
      await user.type(await screen.findByLabelText('First Name'), 'John');
      await user.type(await screen.findByLabelText('Last Name'), 'Doe');
      await user.type(await screen.findByLabelText('Email'), 'john@example.com');
      await user.type(await screen.findByLabelText('Password'), 'Password123');
      await user.type(await screen.findByLabelText('Confirm Password'), 'Password123');
      await user.click(await screen.findByRole('button', { name: 'Next' }));

      // Wait and fill step 2
      await waitFor(() => {
        expect(screen.getByLabelText('Club Affiliation')).toBeInTheDocument();
      });

      await user.type(screen.getByLabelText('Club Affiliation'), 'Yacht Club');
      await user.type(screen.getByLabelText('Phone Number'), '+1234567890');
      await user.click(screen.getAllByRole('button', { name: 'Next' })[0]);

      // Wait for step 3
      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Create Account' })).toBeInTheDocument();
      });

      await user.click(screen.getByRole('button', { name: 'Create Account' }));

      await waitFor(() => {
        expect(mockMutateAsync).toHaveBeenCalledWith({
          email: 'john@example.com',
          password: 'Password123',
          firstName: 'John',
          lastName: 'Doe',
          phone: '+1234567890',
          certificationLevel: undefined,
          clubAffiliation: 'Yacht Club',
        });
        expect(mockNavigate).toHaveBeenCalledWith('/');
      });
    });
  });

  describe('Navigation', () => {
    it('should navigate to login when back to login is clicked', async () => {
      const user = userEvent.setup();
      renderWithRouter(<Register />);

      const backButton = await screen.findByText('← Back to Login');
      await user.click(backButton);

      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  describe('Error handling', () => {
    it('should display error message on registration failure', async () => {
      mockMutateAsync.mockRejectedValueOnce(new Error('Registration failed'));

      const user = userEvent.setup();
      renderWithRouter(<Register />);

      // Fill step 1
      await user.type(await screen.findByLabelText('First Name'), 'John');
      await user.type(await screen.findByLabelText('Last Name'), 'Doe');
      await user.type(await screen.findByLabelText('Email'), 'john@example.com');
      await user.type(await screen.findByLabelText('Password'), 'Password123');
      await user.type(await screen.findByLabelText('Confirm Password'), 'Password123');
      await user.click(await screen.findByRole('button', { name: 'Next' }));

      // Wait for step 2 and go to step 3
      await waitFor(() => {
        expect(screen.getByLabelText('Club Affiliation')).toBeInTheDocument();
      });
      await user.click(screen.getAllByRole('button', { name: 'Next' })[0]);

      // Submit on step 3
      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Create Account' })).toBeInTheDocument();
      });
      await user.click(screen.getByRole('button', { name: 'Create Account' }));

      await waitFor(() => {
        expect(screen.getByText('Registration failed')).toBeInTheDocument();
        expect(screen.getByText('Personal Info')).toBeInTheDocument();
      });
    });
  });
});

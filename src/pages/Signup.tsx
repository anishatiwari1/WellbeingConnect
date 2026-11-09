import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    // Password should be 8-16 characters
    if (password.length < 8 || password.length > 16) {
      return false;
    }
    
    // Must contain at least one uppercase letter
    const hasUppercase = /[A-Z]/.test(password);
    
    // Must contain at least one lowercase letter
    const hasLowercase = /[a-z]/.test(password);
    
    // Must contain at least one number
    const hasNumber = /[0-9]/.test(password);
    
    // Must contain at least one special character (!, @, #, $)
    const hasSpecialChar = /[!@#$]/.test(password);
    
    return hasUppercase && hasLowercase && hasNumber && hasSpecialChar;
  };

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    
    // Length check (0-2 points)
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;
    
    // Character variety checks (1 point each)
    if (/[a-z]/.test(password)) strength += 1; // lowercase
    if (/[A-Z]/.test(password)) strength += 1; // uppercase
    if (/[0-9]/.test(password)) strength += 1; // numbers
    if (/[!@#$]/.test(password)) strength += 1; // special characters
    
    // Bonus for longer passwords
    if (password.length >= 16) strength += 1;
    
    return Math.min(strength, 5); // Cap at 5 for the bar
  };

  const validatePasswordMatch = (password: string, confirmPassword: string) => {
    return password === confirmPassword;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    
    if (value && !validateEmail(value)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    
    // Calculate password strength
    const strength = calculatePasswordStrength(value);
    setPasswordStrength(strength);
    
    if (value && !validatePassword(value)) {
      setPasswordError("Password must be 8-16 characters with at least one uppercase, lowercase, number, and special character (!@#$)");
    } else {
      setPasswordError("");
    }
    
    // Check password match if confirm password is already filled
    if (confirmPassword && !validatePasswordMatch(value, confirmPassword)) {
      setConfirmPasswordError("Passwords do not match");
    } else if (confirmPassword && validatePasswordMatch(value, confirmPassword)) {
      setConfirmPasswordError("");
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmPassword(value);
    
    if (value && !validatePasswordMatch(password, value)) {
      setConfirmPasswordError("Passwords do not match");
    } else {
      setConfirmPasswordError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email before submission
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }
    
    // Validate password before submission
    if (!validatePassword(password)) {
      setPasswordError("Password must be 8-16 characters with at least one uppercase, lowercase, number, and special character (!@#$)");
      return;
    }
    
    // Validate password match before submission
    if (!validatePasswordMatch(password, confirmPassword)) {
      setConfirmPasswordError("Passwords do not match");
      return;
    }
    
    setLoading(true);
    try {
      const fullName = `${firstName} ${lastName}`.trim();
      await signUp(fullName, email, password);
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-[80vh] items-center justify-center animate-enter">
      <Card className="w-full max-w-md bg-gradient-card border-0 shadow-[var(--shadow-elegant)]">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold text-foreground">Create Account</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit} autoComplete="off">
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block mb-1 text-sm font-medium text-muted-foreground">First Name</label>
                <Input 
                  id="firstName" 
                  type="text" 
                  placeholder="John" 
                  value={firstName} 
                  onChange={e => setFirstName(e.target.value)} 
                  required 
                  className="bg-background" 
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block mb-1 text-sm font-medium text-muted-foreground">Last Name</label>
                <Input 
                  id="lastName" 
                  type="text" 
                  placeholder="Doe" 
                  value={lastName} 
                  onChange={e => setLastName(e.target.value)} 
                  required 
                  className="bg-background" 
                />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block mb-1 text-sm font-medium text-muted-foreground">Email</label>
              <Input 
                id="email" 
                type="email" 
                placeholder="you@email.com" 
                value={email} 
                onChange={handleEmailChange} 
                required 
                className={`bg-background ${emailError ? 'border-destructive' : ''}`}
              />
              {emailError && (
                <p className="mt-1 text-sm text-destructive">{emailError}</p>
              )}
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="password" className="text-sm font-medium text-muted-foreground">Enter Password</label>
                {/* Password Strength Indicator */}
                {password && (
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-muted rounded-full h-1.5">
                      <div 
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          passwordStrength <= 1 ? 'bg-destructive' :
                          passwordStrength <= 2 ? 'bg-orange-500' :
                          passwordStrength <= 3 ? 'bg-yellow-500' :
                          passwordStrength <= 4 ? 'bg-blue-500' :
                          'bg-green-500'
                        }`}
                        style={{ width: `${(passwordStrength / 5) * 100}%` }}
                      />
                    </div>
                    <span className={`text-xs font-medium ${
                      passwordStrength <= 1 ? 'text-destructive' :
                      passwordStrength <= 2 ? 'text-orange-500' :
                      passwordStrength <= 3 ? 'text-yellow-500' :
                      passwordStrength <= 4 ? 'text-blue-500' :
                      'text-green-500'
                    }`}>
                      {passwordStrength <= 1 ? 'Weak' :
                       passwordStrength <= 2 ? 'Fair' :
                       passwordStrength <= 3 ? 'Good' :
                       passwordStrength <= 4 ? 'Strong' :
                       'Very Strong'}
                    </span>
                  </div>
                )}
              </div>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                value={password} 
                onChange={handlePasswordChange} 
                required 
                className={`bg-background ${passwordError ? 'border-destructive' : ''}`}
              />
              
              {passwordError && (
                <p className="mt-1 text-sm text-destructive">{passwordError}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block mb-1 text-sm font-medium text-muted-foreground">Confirm Password</label>
              <Input 
                id="confirmPassword" 
                type="password" 
                placeholder="••••••••" 
                value={confirmPassword} 
                onChange={handleConfirmPasswordChange} 
                required 
                className={`bg-background ${confirmPasswordError ? 'border-destructive' : ''}`}
              />
              
              {confirmPasswordError && (
                <p className="mt-1 text-sm text-destructive">{confirmPasswordError}</p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating..." : "Sign Up"}
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              Already have an account? <Link to="/login" className="text-primary hover:underline">Log in</Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </main>
  );
};

export default Signup;

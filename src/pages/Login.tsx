import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();
  const { signIn } = useAuth();

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
    
    if (value && !validatePassword(value)) {
      setPasswordError("Password must be 8-16 characters with at least one uppercase, lowercase, number, and special character (!@#$)");
    } else {
      setPasswordError("");
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
    
    setLoading(true);
    try {
      await signIn(email, password);
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-[80vh] items-center justify-center animate-enter">
      <Card className="w-full max-w-md bg-gradient-card border-0 shadow-[var(--shadow-elegant)]">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold text-foreground">Sign In</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit} autoComplete="off">
          <CardContent className="space-y-6">
            <div>
              <label htmlFor="email" className="block mb-1 text-sm font-medium text-muted-foreground">Email</label>
              <Input 
                id="email" 
                type="email" 
                placeholder="you@email.com" 
                value={email} 
                onChange={handleEmailChange} 
                required 
                autoFocus 
                className={`bg-background ${emailError ? 'border-destructive' : ''}`}
              />
              {emailError && (
                <p className="mt-1 text-sm text-destructive">{emailError}</p>
              )}
            </div>
            <div>
              <label htmlFor="password" className="block mb-1 text-sm font-medium text-muted-foreground">Password</label>
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
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
            <Button type="button" variant="outline" className="w-full" asChild>
              <Link to="/signup">Create an account</Link>
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              Forgot your password? <a href="#" className="text-primary hover:underline">Reset</a>
            </div>
          </CardFooter>
        </form>
      </Card>
    </main>
  );
};

export default Login;

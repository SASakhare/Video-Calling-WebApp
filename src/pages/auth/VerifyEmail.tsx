import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";

export default function VerifyEmail() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const email = useAuthStore((s) => s.user?.email) || "your inbox";
  const navigate = useNavigate();

  const submit = async () => {
    if (code.length < 6) return toast.error("Enter the 6-digit code");
    setLoading(true);
    try { await authService.verifyEmail(code); toast.success("Email verified"); navigate("/dashboard"); }
    finally { setLoading(false); }
  };

  return (
    <div className="text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-brand-soft text-primary">
        <MailCheck className="h-6 w-6" />
      </div>
      <h1 className="text-2xl font-bold tracking-tight">Verify your email</h1>
      <p className="mt-2 text-sm text-muted-foreground">We sent a 6-digit code to <span className="font-medium text-foreground">{email}</span>.</p>

      <div className="mt-8 flex justify-center">
        <InputOTP maxLength={6} value={code} onChange={setCode}>
          <InputOTPGroup>
            {[0,1,2,3,4,5].map((i) => <InputOTPSlot key={i} index={i} />)}
          </InputOTPGroup>
        </InputOTP>
      </div>

      <Button onClick={submit} disabled={loading} className="mt-8 h-11 w-full rounded-xl bg-gradient-brand text-primary-foreground btn-glow">
        {loading ? "Verifying…" : "Verify email"}
      </Button>
      <button className="mt-4 text-sm text-muted-foreground hover:text-foreground" onClick={() => toast.success("New code sent")}>
        Didn't get it? Resend
      </button>
    </div>
  );
}

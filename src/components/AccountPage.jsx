"use client";
import { useState } from "react";
import { User, Mail, Lock, Trash2, Shield, ChevronLeft } from "lucide-react";
import { updateProfile, updateEmail, updatePassword, deleteAccount } from "@/lib/supabase";

export default function AccountPage({ user, profile, onBack, onProfileUpdate, onSignOut }) {
  const [editName, setEditName] = useState(false);
  const [nameValue, setNameValue] = useState(profile?.name || user?.name || "");
  const [editEmail, setEditEmail] = useState(false);
  const [emailValue, setEmailValue] = useState(profile?.email || user?.email || "");
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showDelete, setShowDelete] = useState(false);
  const [message, setMessage] = useState(null);
  const [saving, setSaving] = useState(false);

  const flash = (msg, isError) => {
    setMessage({ text: msg, error: isError });
    setTimeout(() => setMessage(null), 4000);
  };

  const handleNameSave = async () => {
    if (!nameValue.trim()) return;
    setSaving(true);
    if (profile?.id) {
      const { error } = await updateProfile(profile.id, { name: nameValue.trim() });
      if (error) { flash(error.message, true); setSaving(false); return; }
    }
    onProfileUpdate?.({ name: nameValue.trim() });
    setEditName(false);
    flash("Name updated");
    setSaving(false);
  };

  const handleEmailSave = async () => {
    if (!emailValue.trim()) return;
    setSaving(true);
    const { error } = await updateEmail(emailValue.trim());
    if (error) { flash(error.message, true); setSaving(false); return; }
    if (profile?.id) {
      await updateProfile(profile.id, { email: emailValue.trim() });
    }
    onProfileUpdate?.({ email: emailValue.trim() });
    setEditEmail(false);
    flash("Email updated — check your inbox to confirm");
    setSaving(false);
  };

  const handlePasswordSave = async () => {
    if (newPassword.length < 6) { flash("Password must be at least 6 characters", true); return; }
    if (newPassword !== confirmPassword) { flash("Passwords don't match", true); return; }
    setSaving(true);
    const { error } = await updatePassword(newPassword);
    if (error) { flash(error.message, true); setSaving(false); return; }
    setShowPassword(false);
    setNewPassword("");
    setConfirmPassword("");
    flash("Password updated");
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!profile?.id) return;
    setSaving(true);
    await deleteAccount(profile.id);
    onSignOut?.();
    setSaving(false);
  };

  const inp = {
    width: "100%", padding: "10px 12px", border: "1.5px solid var(--noshd-border)",
    borderRadius: "4px", fontSize: "14px", outline: "none", boxSizing: "border-box",
    fontFamily: "var(--font-body)", background: "#fff", color: "var(--noshd-charcoal)",
  };

  const sectionStyle = {
    padding: "16px 20px", border: "1px solid var(--noshd-border)", borderRadius: "4px",
    background: "#fff", marginBottom: "10px",
  };

  const btnPrimary = {
    padding: "8px 18px", background: "var(--noshd-charcoal)", color: "white",
    border: "2px solid var(--noshd-charcoal)", borderRadius: "4px", fontSize: "13px",
    fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-body)", textTransform: "lowercase",
  };

  const btnOutline = {
    padding: "8px 18px", background: "none", border: "1.5px solid var(--noshd-border)",
    borderRadius: "4px", fontSize: "13px", fontWeight: 600, cursor: "pointer",
    fontFamily: "var(--font-body)", color: "var(--noshd-muted)", textTransform: "lowercase",
  };

  return (
    <div style={{ maxWidth: "560px", margin: "0 auto", padding: "0 20px 60px", animation: "fadeUp 0.3s ease" }}>
      <button onClick={onBack}
        style={{ ...btnOutline, borderRadius: "50px", display: "flex", alignItems: "center", gap: "5px", marginBottom: "20px", padding: "6px 14px" }}>
        <ChevronLeft size={13} /> back
      </button>

      <h1 style={{ margin: "0 0 4px", fontFamily: "var(--font-display)", fontSize: "28px", fontWeight: 400, color: "var(--noshd-charcoal)" }}>my account</h1>
      <p style={{ fontSize: "13px", color: "var(--noshd-muted)", fontFamily: "var(--font-body)", marginBottom: "20px" }}>
        manage your profile and account settings
      </p>

      {/* Flash message */}
      {message && (
        <div style={{
          padding: "10px 16px", borderRadius: "4px", marginBottom: "14px", fontSize: "13px",
          fontFamily: "var(--font-body)", animation: "fadeUp 0.2s ease",
          background: message.error ? "#FEF2F2" : "#F0FDF4",
          color: message.error ? "#DC2626" : "#16A34A",
          border: `1px solid ${message.error ? "#FECACA" : "#BBF7D0"}`,
        }}>
          {message.text}
        </div>
      )}

      {/* Tier badge */}
      <div style={{ ...sectionStyle, display: "flex", alignItems: "center", gap: "12px" }}>
        <Shield size={18} color={user?.tier === "premium" ? "#F59E0B" : "var(--noshd-muted)"} />
        <div>
          <div style={{ fontSize: "14px", fontWeight: 600, fontFamily: "var(--font-body)", color: "var(--noshd-charcoal)", textTransform: "lowercase" }}>
            {user?.tier === "premium" ? "premium member" : "free plan"}
          </div>
          <div style={{ fontSize: "12px", color: "var(--noshd-muted)", fontFamily: "var(--font-body)" }}>
            {user?.tier === "premium" ? "no ads, all features" : "includes ads"}
          </div>
        </div>
      </div>

      {/* Name */}
      <div style={sectionStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: editName ? "12px" : 0 }}>
          <User size={15} color="var(--noshd-muted)" />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "11px", color: "var(--noshd-faint)", textTransform: "uppercase", letterSpacing: "1px", fontFamily: "var(--font-body)", marginBottom: "2px" }}>name</div>
            {!editName && (
              <div style={{ fontSize: "14px", color: "var(--noshd-charcoal)", fontFamily: "var(--font-body)" }}>{profile?.name || user?.name || "—"}</div>
            )}
          </div>
          {!editName && (
            <button onClick={() => setEditName(true)} style={btnOutline}>edit</button>
          )}
        </div>
        {editName && (
          <div style={{ display: "flex", gap: "8px" }}>
            <input value={nameValue} onChange={e => setNameValue(e.target.value)} style={{ ...inp, flex: 1 }} placeholder="your name" />
            <button onClick={handleNameSave} disabled={saving} style={btnPrimary}>save</button>
            <button onClick={() => { setEditName(false); setNameValue(profile?.name || user?.name || ""); }} style={btnOutline}>cancel</button>
          </div>
        )}
      </div>

      {/* Email */}
      <div style={sectionStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: editEmail ? "12px" : 0 }}>
          <Mail size={15} color="var(--noshd-muted)" />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "11px", color: "var(--noshd-faint)", textTransform: "uppercase", letterSpacing: "1px", fontFamily: "var(--font-body)", marginBottom: "2px" }}>email</div>
            {!editEmail && (
              <div style={{ fontSize: "14px", color: "var(--noshd-charcoal)", fontFamily: "var(--font-body)" }}>{profile?.email || user?.email || "—"}</div>
            )}
          </div>
          {!editEmail && (
            <button onClick={() => setEditEmail(true)} style={btnOutline}>edit</button>
          )}
        </div>
        {editEmail && (
          <div style={{ display: "flex", gap: "8px" }}>
            <input value={emailValue} onChange={e => setEmailValue(e.target.value)} style={{ ...inp, flex: 1 }} type="email" placeholder="email address" />
            <button onClick={handleEmailSave} disabled={saving} style={btnPrimary}>save</button>
            <button onClick={() => { setEditEmail(false); setEmailValue(profile?.email || user?.email || ""); }} style={btnOutline}>cancel</button>
          </div>
        )}
      </div>

      {/* Password */}
      <div style={sectionStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: showPassword ? "12px" : 0 }}>
          <Lock size={15} color="var(--noshd-muted)" />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "11px", color: "var(--noshd-faint)", textTransform: "uppercase", letterSpacing: "1px", fontFamily: "var(--font-body)", marginBottom: "2px" }}>password</div>
            {!showPassword && (
              <div style={{ fontSize: "14px", color: "var(--noshd-charcoal)", fontFamily: "var(--font-body)" }}>••••••••</div>
            )}
          </div>
          {!showPassword && (
            <button onClick={() => setShowPassword(true)} style={btnOutline}>change</button>
          )}
        </div>
        {showPassword && (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <input value={newPassword} onChange={e => setNewPassword(e.target.value)} style={inp} type="password" placeholder="new password (min 6 characters)" />
            <input value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} style={inp} type="password" placeholder="confirm new password" />
            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={handlePasswordSave} disabled={saving} style={btnPrimary}>update password</button>
              <button onClick={() => { setShowPassword(false); setNewPassword(""); setConfirmPassword(""); }} style={btnOutline}>cancel</button>
            </div>
          </div>
        )}
      </div>

      {/* Danger zone */}
      <div style={{ ...sectionStyle, borderColor: "#FECACA" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: showDelete ? "12px" : 0 }}>
          <Trash2 size={15} color="#DC2626" />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "14px", fontWeight: 600, color: "#DC2626", fontFamily: "var(--font-body)", textTransform: "lowercase" }}>delete account</div>
            <div style={{ fontSize: "12px", color: "var(--noshd-muted)", fontFamily: "var(--font-body)" }}>permanently remove your account and all saved data</div>
          </div>
          {!showDelete && (
            <button onClick={() => setShowDelete(true)}
              style={{ ...btnOutline, borderColor: "#FECACA", color: "#DC2626" }}>delete</button>
          )}
        </div>
        {showDelete && (
          <div style={{ padding: "12px", background: "#FEF2F2", borderRadius: "4px" }}>
            <p style={{ fontSize: "13px", color: "#DC2626", fontFamily: "var(--font-body)", marginBottom: "10px" }}>
              this action cannot be undone. all your saved restaurants and profile data will be permanently deleted.
            </p>
            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={handleDelete} disabled={saving}
                style={{ ...btnPrimary, background: "#DC2626", borderColor: "#DC2626" }}>
                yes, delete my account
              </button>
              <button onClick={() => setShowDelete(false)} style={btnOutline}>cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

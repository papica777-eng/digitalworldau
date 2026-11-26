//! Sovereign Digital World AU WebAssembly Engine (V2).
//! Provides deterministic audit scoring, integer-atomic AUD/EUR & ROI math,
//! fast integer wave interference for 3D lattice telemetry,
//! and Zero-Trust file header validation in O(1) time.

pub const MAX_UPLOAD_BYTES: u32 = 10_485_760; // 10 MiB

/// Computes a deterministic 0-100 website performance & SEO audit score.
#[unsafe(no_mangle)]
pub extern "C" fn audit_score_estimate(
    lcp_ms: u32,
    cls_milli: u32,
    seo_checks_passed: u32,
) -> u32 {
    let lcp_score: u32 = if lcp_ms <= 1200 {
        40
    } else if lcp_ms >= 4500 {
        5
    } else {
        let penalty = ((lcp_ms - 1200) * 35) / 3300;
        40u32.saturating_sub(penalty)
    };

    let cls_score: u32 = if cls_milli <= 50 {
        25
    } else if cls_milli >= 300 {
        3
    } else {
        let penalty = ((cls_milli - 50) * 22) / 250;
        25u32.saturating_sub(penalty)
    };

    let clamped_seo = if seo_checks_passed > 10 {
        10
    } else {
        seo_checks_passed
    };
    let seo_score = (clamped_seo * 35) / 10;

    let total = lcp_score + cls_score + seo_score;
    if total > 100 { 100 } else { total }
}

/// Converts EUR cents to AUD cents using basis-point exchange rate (e.g. 16500 = 1.6500).
#[unsafe(no_mangle)]
pub extern "C" fn convert_eur_cents_to_aud_cents(eur_cents: u64, rate_bps: u32) -> u64 {
    if rate_bps == 0 {
        return 0;
    }
    let scaled = eur_cents.saturating_mul(rate_bps as u64);
    scaled.saturating_add(5_000) / 10_000
}

/// Computes projected monthly revenue in integer cents given monthly visitors,
/// conversion rate in basis points (e.g. 280 = 2.80%), and average order value in cents.
#[unsafe(no_mangle)]
pub extern "C" fn roi_projection_cents(
    monthly_visitors: u32,
    conv_bps: u32,
    aov_cents: u64,
) -> u64 {
    if monthly_visitors == 0 || conv_bps == 0 || aov_cents == 0 {
        return 0;
    }
    let orders_x10000 = (monthly_visitors as u64).saturating_mul(conv_bps as u64);
    orders_x10000.saturating_mul(aov_cents).saturating_add(5_000) / 10_000
}

/// Fast deterministic triangle-harmonic wave displacement in milli-units (-1000..=1000)
/// for driving interactive lattice / shader telemetry without floating-point drift.
#[unsafe(no_mangle)]
pub extern "C" fn compute_wave_displacement(x_milli: i32, y_milli: i32, time_ms: u32) -> i32 {
    let phase_a = (x_milli.wrapping_mul(3).wrapping_add(time_ms as i32)).rem_euclid(4000);
    let phase_b = (y_milli.wrapping_mul(2).wrapping_sub((time_ms / 2) as i32)).rem_euclid(4000);

    let tri_a = if phase_a < 2000 {
        phase_a - 1000
    } else {
        3000 - phase_a
    };
    let tri_b = if phase_b < 2000 {
        phase_b - 1000
    } else {
        3000 - phase_b
    };

    (tri_a + tri_b) / 2
}

/// Zero-trust magic-byte & size validation for uploaded project briefs.
/// Returns: 0 = rejected, 1 = PDF, 2 = PNG, 3 = JPEG, 4 = DOC/DOCX.
#[unsafe(no_mangle)]
pub extern "C" fn validate_upload_header(
    b0: u8,
    b1: u8,
    b2: u8,
    b3: u8,
    b4: u8,
    b5: u8,
    b6: u8,
    b7: u8,
    byte_size: u32,
) -> u32 {
    if byte_size == 0 || byte_size > MAX_UPLOAD_BYTES {
        return 0;
    }

    if b0 == 0x25 && b1 == 0x50 && b2 == 0x44 && b3 == 0x46 {
        return 1;
    }

    if b0 == 0x89
        && b1 == 0x50
        && b2 == 0x4E
        && b3 == 0x47
        && b4 == 0x0D
        && b5 == 0x0A
        && b6 == 0x1A
        && b7 == 0x0A
    {
        return 2;
    }

    if b0 == 0xFF && b1 == 0xD8 && b2 == 0xFF {
        return 3;
    }

    let is_ole_doc = b0 == 0xD0
        && b1 == 0xCF
        && b2 == 0x11
        && b3 == 0xE0
        && b4 == 0xA1
        && b5 == 0xB1
        && b6 == 0x1A
        && b7 == 0xE1;
    let is_docx = b0 == 0x50 && b1 == 0x4B && b2 == 0x03 && b3 == 0x04;
    if is_ole_doc || is_docx {
        return 4;
    }

    0
}

/// Deterministic FNV-1a-style mixer for client inquiry reference codes.
#[unsafe(no_mangle)]
pub extern "C" fn compute_inquiry_ref(
    name_len: u32,
    email_hash: u32,
    budget_tier: u32,
    salt: u32,
) -> u32 {
    let mut h: u32 = 0x811c_9dc5;
    for v in [name_len, email_hash, budget_tier, salt] {
        h ^= v;
        h = h.wrapping_mul(0x0100_0193);
    }
    h
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_audit_score_bounds() {
        assert_eq!(audit_score_estimate(950, 10, 10), 100);
        assert_eq!(audit_score_estimate(5000, 400, 0), 8);
        assert!(audit_score_estimate(2400, 120, 7) < 100);
    }

    #[test]
    fn test_integer_currency_and_roi() {
        assert_eq!(convert_eur_cents_to_aud_cents(200_000, 16_500), 330_000);
        // 50,000 visitors * 3.00% (300 bps) = 1,500 orders * $120.00 (12_000 cents) = 18_000_000 cents ($180,000)
        assert_eq!(roi_projection_cents(50_000, 300, 12_000), 18_000_000);
    }

    #[test]
    fn test_wave_displacement_bounded() {
        for t in [0u32, 450, 1337, 9999] {
            let d = compute_wave_displacement(500, -350, t);
            assert!((-1000..=1000).contains(&d));
        }
    }

    #[test]
    fn test_upload_magic_bytes() {
        assert_eq!(validate_upload_header(0x25, 0x50, 0x44, 0x46, 0, 0, 0, 0, 1024), 1);
        assert_eq!(
            validate_upload_header(0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 2048),
            2
        );
        assert_eq!(validate_upload_header(0xFF, 0xD8, 0xFF, 0xE0, 0, 0, 0, 0, 4096), 3);
        assert_eq!(validate_upload_header(0x50, 0x4B, 0x03, 0x04, 0, 0, 0, 0, 4096), 4);
        assert_eq!(validate_upload_header(0x25, 0x50, 0x44, 0x46, 0, 0, 0, 0, MAX_UPLOAD_BYTES + 1), 0);
        assert_eq!(validate_upload_header(0x4D, 0x5A, 0x90, 0x00, 0, 0, 0, 0, 1024), 0);
    }
}

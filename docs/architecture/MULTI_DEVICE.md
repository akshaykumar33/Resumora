# Multi-Device Architecture (Phase 7+ Roadmap)

Cross-device continuity extends Resumora's local-first client runtime to server-assisted handoff:
1. **Device Fingerprinting & Identity**: Devices maintain unique ephemeral cryptographic identities.
2. **Checkpoint Uplink**: Verified checkpoints are optionally synchronized to an encrypted backend blob store.
3. **Session Handoff**: Scanning a QR code or logging in on a secondary device retrieves the latest server checkpoint to seamlessly resume work.

# Contributing to Catatan Belanja Cerdas

Terima kasih atas minat Anda untuk berkontribusi! 🎉

## Cara Berkontribusi

### Melaporkan Bug
1. Cek apakah bug sudah dilaporkan di Issues
2. Jika belum, buat Issue baru dengan template:
   - Deskripsi bug
   - Langkah untuk reproduce
   - Expected behavior
   - Screenshots (jika ada)
   - Device info (OS, version)

### Mengusulkan Fitur Baru
1. Buat Issue dengan label "enhancement"
2. Jelaskan use case dan manfaatnya
3. Diskusikan dengan maintainer sebelum mulai coding

### Pull Request Process

1. **Fork** repository ini
2. **Clone** fork Anda:
   ```bash
   git clone https://github.com/your-username/catatan-belanja.git
   ```

3. **Buat branch** untuk fitur/fix Anda:
   ```bash
   git checkout -b feature/nama-fitur
   ```

4. **Commit** perubahan dengan pesan yang jelas:
   ```bash
   git commit -m "feat: tambah fitur barcode scanner"
   ```

5. **Push** ke fork Anda:
   ```bash
   git push origin feature/nama-fitur
   ```

6. **Buat Pull Request** ke branch `main`

### Commit Message Convention

Gunakan format berikut:
- `feat:` untuk fitur baru
- `fix:` untuk bug fix
- `docs:` untuk perubahan dokumentasi
- `style:` untuk formatting, missing semicolons, dll
- `refactor:` untuk refactoring code
- `test:` untuk menambah tests
- `chore:` untuk maintenance tasks

Contoh:
```
feat: tambah notifikasi untuk barang yang hampir habis
fix: perbaiki crash saat import data kosong
docs: update README dengan screenshot
```

### Code Style

- Gunakan TypeScript untuk type safety
- Follow existing code style (indentation, naming conventions)
- Tambahkan comments untuk logic yang kompleks
- Pastikan tidak ada TypeScript errors

### Testing

Sebelum submit PR:
1. Test di Android dan iOS (jika memungkinkan)
2. Test semua fitur yang terpengaruh
3. Pastikan tidak ada regression bugs
4. Test export/import functionality

### Documentation

Jika menambah fitur baru:
1. Update README.md
2. Update API.md jika ada API changes
3. Update CHANGELOG.md
4. Tambahkan comments di code

## Development Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm start
   ```

3. Run on device/emulator:
   ```bash
   npm run android  # untuk Android
   npm run ios      # untuk iOS (Mac only)
   ```

## Project Structure

Lihat [ARCHITECTURE.md](ARCHITECTURE.md) untuk detail arsitektur.

## Questions?

Jangan ragu untuk bertanya di Issues atau Discussions!

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the community
- Show empathy towards other contributors

---

Terima kasih telah berkontribusi! 🙏

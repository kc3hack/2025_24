import express, { Request, Response, Router } from 'express';
import { getDb } from '../db';
import { User } from '../types/User';
import multer from 'multer';
import sharp from 'sharp';
import { calculateCurrentStamina } from '../utils/stamina';

const router: Router = express.Router();

// multerの設定
const upload = multer({
  storage: multer.memoryStorage(),  // メモリストレージを使用
  limits: {
    fileSize: 5 * 1024 * 1024  // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      cb(new Error('image file only'));
    } else {
      cb(null, true);
    }
  }
}).single('profile_image');

// ユーザー情報を取得
router.get('/:id/profile', async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const user = await db.get(
      'SELECT id, name, mail_address, current_streak, current_break, stamina, last_stamina_update, xp, profile_image, profile_image_type, created_at FROM users WHERE id = ?',
      [req.user!.id]
    );


    if (!user) {
      res.status(404).json({ error: 'user not found' });
    } else {
      // スタミナの計算
      const currentStamina = calculateCurrentStamina(user.stamina, user.last_stamina_update);

      // スタミナが更新されている場合はDBを更新
      if (currentStamina !== user.stamina) {
        await db.run(
          'UPDATE users SET stamina = ?, last_stamina_update = CURRENT_TIMESTAMP WHERE id = ?',
          [currentStamina, user.id]
        );
        user.stamina = currentStamina;
      }

      // ユーザーのランク情報を取得
      const ranks = await db.all(`
        SELECT dm.name as dialect_name, r.rank_name
        FROM user_ranks ur
        JOIN ranks r ON ur.rank_id = r.id
        JOIN dialect_modes dm ON r.dialect_mode_id = dm.id
        WHERE ur.user_id = ?
      `, [req.user!.id]);

      // プロフィール画像の最適化
      let profileImageUrl;
      if (user.profile_image) {
        const optimizedBuffer = await sharp(user.profile_image)
          .resize(150, 150, {
            fit: 'cover',
            position: 'center'
          })
          .webp({ quality: 80 })
          .toBuffer();
        profileImageUrl = `data:image/webp;base64,${optimizedBuffer.toString('base64')}`;
      }

      // レスポンスの作成
      const responseUser: User = {
        id: user.id,
        name: user.name,
        mail_address: user.mail_address,
        current_streak: user.current_streak,
        current_break: user.current_break,
        stamina: currentStamina,
        last_stamina_update: user.last_stamina_update,
        xp: user.xp,
        created_at: user.created_at,
        profile_image_url: profileImageUrl,
        ranks: {
          osaka: ranks.find(r => r.dialect_name === 'osaka')?.rank_name,
          kyoto: ranks.find(r => r.dialect_name === 'kyoto')?.rank_name,
          kobe: ranks.find(r => r.dialect_name === 'kobe')?.rank_name
        },
      };

      res.json(responseUser);
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'server error' });
  }
});


// プロフィール画像アップロード
router.post('/profile/image', (req: Request, res: Response) => {
  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      res.status(400).json({ message: 'file size is under 5MB' });
    } else if (err) {
      res.status(400).json({ message: err.message });
    }else{
      try {
        if (!req.file) {
          res.status(400).json({ message: 'file is not uploaded' });
        } else {
          // 画像を圧縮
          const optimizedBuffer = await sharp(req.file.buffer)
            .resize(150, 150, {  // プロフィール画像用に小さくリサイズ
              fit: 'cover',
              position: 'center'
            })
            .webp({ quality: 80 })  // WebPフォーマットで圧縮（より効率的）
            .toBuffer();

          const db = await getDb();
          await db.run(
            'UPDATE users SET profile_image = ?, profile_image_type = ? WHERE id = ?',
            [optimizedBuffer, 'image/webp', req.user!.id]
          );

          res.json({
            message: 'profile image updated',
            profile_image_url: `data:image/webp;base64,${optimizedBuffer.toString('base64')}`
          });
        }
      } catch (error) {
        console.error('Error uploading profile image:', error);
        res.status(500).json({ message: 'server error' });
      }
    }

    try{

    }catch(error){
      res.status(500).json({ message: 'server error' });
    }
  });
});

export default router;
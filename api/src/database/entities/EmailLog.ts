import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Concern } from './Concern';

@Entity('email_logs')
export class EmailLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  to_address: string;

  @Column({ type: 'varchar' })
  subject: string;

  @Column({ type: 'text' })
  body: string;

  @CreateDateColumn()
  sent_at: Date;

  @ManyToOne(() => Concern, (concern) => concern.emailLogs, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'concern_id' })
  concern: Concern;
}

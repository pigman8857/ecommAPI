import { UserEntity } from "src/users/entities/user.entity";
import { 
  Column, 
  CreateDateColumn, 
  Entity, 
  PrimaryGeneratedColumn, 
  Timestamp, 
  UpdateDateColumn, 
  ManyToOne
} from "typeorm";

@Entity({name: 'categories'})
export class CategoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @CreateDateColumn()
  createdDate: Timestamp;

  @UpdateDateColumn()
  updatedDate: Timestamp;

  @ManyToOne(()=>UserEntity, (user) => user.categories)
  addedBy: UserEntity;
}

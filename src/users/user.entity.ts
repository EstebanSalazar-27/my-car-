import { Exclude } from 'class-transformer';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  AfterInsert,
  AfterUpdate,
  AfterRemove,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  email: string;
  // Exclude the password field at the moment to return the entity as json
  @Column()
  @Exclude()
  password: string;
  @AfterInsert()
  logInser() {
    console.log('Inserted user with id , ', this.id);
  }
  @AfterUpdate()
  logUpdated() {
    console.log('Updated user with id', this.id);
  }
  @AfterRemove()
  logRemoved() {
    console.log('User has been removed');
  }
}

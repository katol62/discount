ALTER TABLE `cards` DROP COLUMN `service`;

ALTER TABLE `cards` ADD `discount` INT NOT NULL DEFAULT '0' AFTER `type`;

ALTER TABLE `cards` ADD `pass` ENUM('0','1','3','6') NOT NULL DEFAULT '0' AFTER `discount`;

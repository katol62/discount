--
-- Update cards - add additional fields
--
ALTER TABLE `cards` ADD `type` ENUM('adult','child','other') NOT NULL DEFAULT 'adult' AFTER `transh`, ADD `service` ENUM('discount','pass') NOT NULL DEFAULT 'discount' AFTER `type`, ADD `status` ENUM('published','sold','activated','overdue','blocked') NOT NULL DEFAULT 'published' AFTER `service`, ADD `lifetime` INT NULL DEFAULT NULL AFTER `status`, ADD `servicetime` INT NULL DEFAULT NULL AFTER `lifetime`, ADD `test` ENUM('0','1') NOT NULL DEFAULT '0';

--
-- Update cards - add default values
--
ALTER TABLE `cards` CHANGE `oid` `oid` INT(11) NOT NULL DEFAULT '0', CHANGE `tid` `tid` INT(11) NOT NULL DEFAULT '0', CHANGE `transh` `transh` INT(11) NOT NULL DEFAULT '0';

ALTER TABLE `cards` CHANGE `qr_code` `qr_code` VARCHAR(128) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL, CHANGE `card_nb` `card_nb` VARCHAR(128) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL;

--
-- Update tariff - add soft/hard field
--
ALTER TABLE `tariff` ADD `soft` ENUM('0','1') NOT NULL DEFAULT '0' AFTER `owner`;
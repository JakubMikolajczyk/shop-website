USE [weppo]
GO

/****** Object:  Table [dbo].[PRODUCT_TAGS]    Script Date: 01.02.2022 20:21:17 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[PRODUCT_TAGS](
	[product_id] [int] NULL,
	[tag] [nvarchar](20) NULL
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[PRODUCT_TAGS]  WITH CHECK ADD  CONSTRAINT [FK_PRODUCT_TAGS_PRODUCT] FOREIGN KEY([product_id])
REFERENCES [dbo].[PRODUCT] ([id])
GO

ALTER TABLE [dbo].[PRODUCT_TAGS] CHECK CONSTRAINT [FK_PRODUCT_TAGS_PRODUCT]
GO
